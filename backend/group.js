import logging from '@mwni/log'


export function createGroupController({ ctx, meta: groupMeta }){
	let log = logging.fork({ name: groupMeta.name })
	let clients = []
	let chats = []

	async function setupGroup(){
		chats = await ctx.db.chats.readMany({
			where: {
				group: groupMeta
			},
			include: {
				experts: true,
				expertMessages: true,
				userMessages: true
			}
		})

		if(chats.length === 0){
			log.info(`creating genesis chat`)
			await createChat()
		}else{
			chats = chats.map(chat => ({
				...chat,
				typingUsers: {}
			}))
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

			broadcast({
				event: 'chat',
				chat
			})
		})

		client.on('reply', ({ chat: chatId, text }) => {
			let chat = chats.find(c => c.id === chatId)

			delete chat.typingUsers[client.user.id]

			if(!chat.locked){
				chat.userMessages.push({
					user: {
						id: client.user.id
					},
					text,
					timeCreated: Date.now()/1000
				})
	
				chat.locked = true
			}

			broadcast({
				event: 'chat',
				chat
			})
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
			},
			include: {
				experts: true,
				expertMessages: true,
				userMessages: true
			}
		})

		Object.assign(chat, {
			typingUsers: {}
		})

		chats.push(chat)

		broadcast({
			event: 'chats',
			chats
		})
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