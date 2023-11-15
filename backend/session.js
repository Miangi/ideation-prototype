import logging from '@mwni/log'
import { generateExpertResponse, generateExperts, rankExperts, summarizeProblem, validateMessage, validateProblem } from './prompting.js'


export async function createTeamSession({ ctx, team }){
	let log = logging.fork({ name: team.name })
	let clients = []
	let chats = []
	let tasks = await ctx.db.tasks.readMany({
		where: {
			team,
			solution: null
		}
	})

	async function setupTask({ task }){
		log.info(`setting up task #${task.number}`)

		chats = await ctx.db.chats.readMany({
			where: {
				team,
				task
			},
			include: {
				experts: true,
				expertMessages: {
					expert: true
				},
				userMessages: {
					user: true
				},
				systemMessages: true
			}
		})

		if(chats.length === 0){
			log.info(`creating genesis chat`)
			await createChat({ task })
		}else{
			chats = chats.map(chat => setupChat(chat))
			log.info(`resumed ${chats.length} chat(s)`)
		}

		broadcast({
			event: 'task',
			task
		})

		broadcast({
			event: 'chats',
			chats
		})
	}

	async function handleUserMessage({ client, chat, text }){
		let userMessage = {
			user: {
				id: client.user.id,
				firstName: client.user.firstName,
				lastName: client.user.lastName
			},
			text,
			timeCreated: new Date()
		}

		chat.messages.push(userMessage)
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

			chat.problemDescription = text
			chat.messages.push({
				text: `(experts)`,
				timeCreated: new Date()
			})

			broadcast({ event: 'chat', chat })

			await Promise.all([
				handleExpertGeneration({ chat, problem: text }),
				handleProblemSummarization({ chat, problem: text })
			])

			chat.messages.push({
				text: `👉 Continue by asking questions or propose ideas`,
				timeCreated: new Date()
			})
			chat.locked = false

			broadcast({ event: 'chat', chat })
			flushChat(chat)
		}else{
			if(!await validateMessage({ ctx, chat })){
				userMessage.valid = false

				chat.messages.push({
					text: `⚠️ Your message makes no sense. Please rephrase it.`,
					timeCreated: new Date()
				})
				chat.locked = false

				broadcast({ event: 'chat', chat })
				flushChat(chat)

				log.info(`message "${text}" makes no sense`)
				return
			}else{
				userMessage.valid = true
			}

			let expertRanking = await rankExperts({ ctx, chat })

			for(let expert of expertRanking){
				for await(let text of generateExpertResponse({ ctx, chat, expert })){
					let message = chat.messages[chat.messages.length - 1]

					if(message.expert?.id !== expert.id){
						message = {
							expert: {
								id: expert.id,
								index: expert.index,
								name: expert.name
							},
							timeCreated: new Date()
						}
						
						chat.messages.push(message)
					}

					message.text = text

					broadcast({ event: 'chat', chat })
				}
			}

			chat.locked = false

			broadcast({ event: 'chat', chat })
			flushChat(chat)
		}
	}

	async function handleExpertGeneration({ chat, problem }){
		for await(var experts of generateExperts({ ctx, problem })){
			chat.experts = experts
			broadcast({ event: 'chat', chat })
		}
	}

	async function handleProblemSummarization({ chat, problem }){
		try{
			let { title, summary } = await summarizeProblem({ ctx, problem })
			
			Object.assign(chat, {
				title,
				problemSummary: summary
			})

			broadcast({ event: 'chat', chat })
		}catch(error){
			log.warn(`failed to create problem summary for "${problem}":`, error)
		}
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
			await createChat({ task: tasks[0] })
			log.info(`user "${client.user.firstName}" created a new chat`)
		})

		client.on('solution', async ({ answers }) => {
			await ctx.db.tasks.updateOne({
				data: {
					solution: answers
				},
				where: {
					id: tasks[0].id
				}
			})

			log.info(`user "${client.user.firstName}" submitted a solution for task #${tasks[0].number}`)
			
			broadcast({ event: 'task-complete' })
			tasks.shift()

			if(tasks.length > 0){	
				await setupTask({ task: tasks[0] })
			}
		})

		client.send({
			event: 'task',
			task: tasks[0]
		})

		client.send({
			event: 'user',
			user: client.user
		})

		broadcast({
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

	async function createChat({ task }){
		let chat = await ctx.db.chats.createOne({
			data: {
				team,
				task: {
					id: task.id
				},
				title: `Ideation ${chats.length + 1}`
			}
		})

		chats.push(setupChat(chat))

		broadcast({
			event: 'chats',
			chats
		})
	}

	function setupChat(chat){
		let messages = [
			...(chat.userMessages || [])
				.map(message => ({
					...message,
					user: {
						id: message.user.id,
						firstName: message.user.firstName,
						lastName: message.user.lastName
					}
				})),
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
		await ctx.db.chats.updateOne({
			data: {
				title: chat.title,
				problemDescription: chat.problemDescription,
				problemSummary: chat.problemSummary
			},
			where: {
				id: chat.id
			}
		})

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

	if(tasks.length > 0){
		await setupTask({ task: tasks[0] })
	}else{
		return {
			...team,
			joinClient(client){
				client.send({
					event: 'task',
					task: null
				})
			}
		}
	}

	return {
		...team,
		joinClient(client){
			log.info(`user "${client.user.firstName}" joined`)
			setupClient(client)
		}
	}
}