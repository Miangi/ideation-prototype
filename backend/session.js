import logging from '@mwni/log'
import { generateExpertResponse, generateExperts, rankExperts, summarizeProblem, validateMessage, validateProblem } from './prompting.js'


export async function createTeamSession({ ctx, team }){
	let log = logging.fork({ name: team.name })
	let clients = []
	let chats = []
	let answers = []
	let solutionAcceptance = []
	let answerFlushTimer
	let tasks = await ctx.db.tasks.readMany({
		where: {
			team,
			complete: false
		}
	})

	async function setupTask({ task }){
		log.info(`setting up task #${task.number}`)

		solutionAcceptance = []
		answers = task.solution
			? task.solution.map(
				text => text
					? {
						text,
						lastEdit: 0
					}
					: null
			)
			: []

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

		broadcast({ 
			event: 'answers', 
			answers 
		})

		broadcast({ 
			event: 'acceptance', 
			acceptance: solutionAcceptance 
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

		try{
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
				chat.busyStatus = { text: 'The experts are thinking' }
				broadcast({ event: 'chat', chat })

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
	
				for(let expert of expertRanking.slice(0, 3)){
					let lastMessage

					chat.busyStatus = { 
						text: `${expert.name} is thinking`, 
						colorIndex: expert.index 
					}
					broadcast({ event: 'chat', chat })
	
					for await(let text of generateExpertResponse({ ctx, chat, expert })){
						lastMessage = chat.messages[chat.messages.length - 1]
	
						if(lastMessage.expert?.id !== expert.id){
							lastMessage = {
								expert: {
									id: expert.id,
									index: expert.index,
									name: expert.name
								},
								timeCreated: new Date()
							}
	
							chat.messages.push(lastMessage)
						}
	
						lastMessage.text = text

						chat.busyStatus = undefined
	
						broadcast({ event: 'chat', chat })
					}
	
					if(!lastMessage)
						break
				}
	
				chat.locked = false
	
				broadcast({ event: 'chat', chat })
				flushChat(chat)
			}
		}catch(error){
			log.error(`error while handling user message:`, error)

			chat.messages.push({
				text: `⛔ There was a problem while generating the answers. Please retry.`,
				timeCreated: new Date()
			})
			chat.locked = false

			broadcast({ event: 'chat', chat })
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

	async function checkAndSubmitSolution(){
		if(clients.some(client => solutionAcceptance.every(a => a.id !== client.user.id)))
			return

		clearTimeout(answerFlushTimer)

		await ctx.db.tasks.updateOne({
			data: {
				solution: answers.map(answer => answer.text),
				complete: true
			},
			where: {
				id: tasks[0].id
			}
		})

		log.info(`all users agreed to  solution for task #${tasks[0].number}`)
		
		broadcast({ event: 'task-complete' })
		tasks.shift()

		if(tasks.length > 0){	
			await setupTask({ task: tasks[0] })
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

		client.on('answer', async ({ index, text }) => {
			answers[index] = {
				text,
				lastEdit: Date.now(),
				lastEditor: client.user
			}

			clearTimeout(answerFlushTimer)
			answerFlushTimer = setTimeout(flushAnswers, 3000)

			broadcast({ event: 'answers', answers })

			if(solutionAcceptance.length > 0){
				solutionAcceptance.length = 0
				broadcast({ event: 'acceptance', acceptance: solutionAcceptance })
			}
		})

		client.on('accept', async () => {
			if(solutionAcceptance.some(a => a === client.user))
				return

			solutionAcceptance.push(client.user)
			broadcast({ event: 'acceptance', acceptance: solutionAcceptance })

			await checkAndSubmitSolution()
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

		client.send({
			event: 'answers',
			answers
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
				users: clients.map(client => client.user)
			})
		})
	}

	async function flushAnswers(){
		await ctx.db.tasks.updateOne({
			data: {
				solution: answers.map(answer => answer.text)
			},
			where: {
				id: tasks[0].id,
				complete: false
			}
		})

		log.info(`flushed answers`)
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