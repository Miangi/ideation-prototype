import logging from '@mwni/log'


export function createGroupController({ ctx, meta: groupMeta }){
	let log = logging.fork({ name: groupMeta.name })
	let clients = []
	let chats = []

	async function setupGroup(){
		chats = await ctx.db.chats.readMany({
			where: {
				group: groupMeta
			}
		})

		if(chats.length === 0){
			log.info(`creating genesis chat`)
			await createChat()
		}
	}

	async function setupClient(client){
		client.on('type', ({ chat: chatId, text }) => {
			let chat = chats.find(c => c.id === chatId)
			let typingUser = chat.typingUsers.find(
				e => e.user.id === client.user.id
			)

			if(text.length > 0){
				if(!typingUser){
					chat.typingUsers.push(typingUser = { user: client.user, text: '' })
					typingUser.text = text
				}
			}else{
				chat.typingUsers = chat.typingUsers.filter(e => e !== typingUser)
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
			event: 'chats',
			chats
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
			typingUsers: []
		})

		chats.push(chat)

		broadcast({
			event: 'chats',
			chats
		})
	}

	function broadcast(payload){
		for(let user of users){
			user.send(payload)
		}
	}

	setupGroup()
		.catch(error => log.warn(`group setup failed: ${error.message}`))

	return {
		...groupMeta,
		joinClient(client){
			clients.push(client)

			client.on('disconnect', code => {
				log.info(`connection from "${client.user.firstName}" closed (code ${code})`)
				clients = clients.filter(c => c !== client)
			})
			
			log.info(`user "${client.user.firstName}" joined`)

			setupClient(client)
		}
	}
}