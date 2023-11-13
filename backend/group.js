import logging from '@mwni/log'
import { generateExperts, validateProblem } from './prompting.js'


export function createGroupController({ ctx, meta: groupMeta }){
	let log = logging.fork({ name: groupMeta.name })
	let clients = []
	let chats = []

	async function handleUserMessage({ client, chat, text }){
		chat.messages.push({
			user: {
				id: client.user.id
			},
			text,
			timeCreated: new Date()
		})

		chat.locked = true

		broadcast({ event: 'chat', chat })

		if(chat.experts.length === 0){
			if(!await validateProblem({ ctx, problem: text })){
				chat.messages.push({
					text: `⚠️ The problem description is not clear enough. Please rephrase it.`,
					timeCreated: new Date()
				})
				chat.locked = false
				broadcast({ event: 'chat', chat })
				flushChat(chat)
				log.info(`problem "${text}" was deemed unclear`)
				return
			}

			chat.messages.push({
				text: `(experts)`,
				timeCreated: new Date()
			})

			broadcast({ event: 'chat', chat })

			for await(var experts of generateExperts({ ctx, problem: text })){
				chat.experts = experts
				broadcast({ event: 'chat', chat })
			}

			chat.messages.push({
				text: `👉 Continue by asking questions or propose ideas`,
				timeCreated: new Date()
			})

			chat.locked = false

			broadcast({ event: 'chat', chat })
			flushChat(chat)
		}
	}

	async function setupGroup(){
		chats = await ctx.db.chats.readMany({
			where: {
				group: groupMeta
			},
			include: {
				experts: true,
				expertMessages: true,
				userMessages: true,
				systemMessages: true
			}
		})

		if(chats.length === 0){
			log.info(`creating genesis chat`)
			await createChat()
		}else{
			chats = chats.map(chat => setupChat(chat))
			log.info(`resumed ${chats.length} chat(s)`)
		}

		broadcast({
			event: 'chats',
			chats
		})
	}

	async function setupClient(client){
		clients.push(client)

		client.on('type', ({ chat: chatId, text }) => {
			let chat = chats.find(c => c.id === chatId)

			chat.typingUsers[client.user.id] = text

			broadcast({ event: 'chat', chat })
		})

		client.on('reply', async ({ chat: chatId, text }) => {
			let chat = chats.find(c => c.id === chatId)

			delete chat.typingUsers[client.user.id]

			if(!chat.locked){
				await handleUserMessage({ client, chat, text })
			}else{
				broadcast({ event: 'chat', chat })
			}
		})

		client.on('new_chat', async () => {
			await createChat()
		})

		client.send({
			event: 'user',
			user: client.user
		})

		client.send({
			event: 'users',
			users: clients.map(client => client.user)
		})

		client.send({
			event: 'chats',
			chats
		})

		client.on('disconnect', ({ code }) => {
			log.info(`connection from "${client.user.firstName}" closed (code ${code})`)
			clients = clients.filter(c => c !== client)

			for(let chat of chats){
				delete chat.typingUsers[client.user.id]
			}

			broadcast({
				event: 'chats',
				chats
			})

			broadcast({
				event: 'users',
				user: clients.map(client => client.user)
			})
		})
	}

	async function createChat(){
		let chat = await ctx.db.chats.createOne({
			data: {
				group: groupMeta,
				title: `Ideation ${chats.length + 1}`
			}
		})

		chats.push(setupChat(chat))

		broadcast({
			event: 'chats',
			chats
		})

		log.info(`created new chat`)
	}

	function setupChat(chat){
		let messages = [
			...(chat.userMessages || []),
			...(chat.expertMessages || []),
			...(chat.systemMessages || [])
		].sort((a, b) => a.timeCreated - b.timeCreated)

		if(messages.length === 0){
			messages.push({
				text: `👉 Start the chat by describing the problem in your own words`,
				timeCreated: new Date()
			})
		}

		return {
			id: chat.id,
			title: chat.title,
			problemDescription: chat.problemDescription,
			problemSummary: chat.problemSummary,
			experts: chat.experts || [],
			typingUsers: {},
			messages
		}
	}

	async function flushChat(chat){
		for(let message of chat.messages){
			if(message.id)
				continue

			let table

			if(message.user)
				table = ctx.db.userMessages
			else if(message.expert)
				table = ctx.db.expertMessages
			else
				table = ctx.db.systemMessages

			let { id } = await table.createOne({
				data: {
					...message,
					chat: {
						id: chat.id
					}
				}
			})

			message.id = id
		}

		for(let expert of chat.experts){
			if(expert.id)
				continue

			let { id } = await ctx.db.experts.createOne({
				data: {
					...expert,
					chat: {
						id: chat.id
					}
				}
			})

			expert.id = id
		}
	}

	function broadcast(payload){
		for(let client of clients){
			client.send(payload)
		}
	}

	setupGroup()
		.catch(error => log.warn(`group setup failed: ${error.message}`))

	return {
		...groupMeta,
		joinClient(client){
			log.info(`user "${client.user.firstName}" joined`)
			setupClient(client)
		}
	}
}