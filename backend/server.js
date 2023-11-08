import { WebSocketServer } from 'ws'
import log from '@mwni/log'
import createDBConnection from './database.js'
import { validateUser } from './user.js'
import { createGroupController } from './group.js'

export default ({ port }) => {
	let ctx = {
		db: createDBConnection()
	}
	let groups = []
	let server = new WebSocketServer({
		port
	})

	server.on('connection', async (socket, request) => {
		let ip = request.socket.remoteAddress

		log.info(`new connection from ${ip}`)

		try{
			let user = await validateUser({ ctx, socket, request })
			let group = groups.find(g => g.id === user.group.id)

			if(!group){
				log.info(`creating group controller for "${user.group.name}"`)
				group = createGroupController({ meta: user.group })
				groups.push(group)
			}

			group.joinUser({
				socket,
				user
			})
		}catch(error){
			log.warn(`failed to validate user ${ip}: ${error.message}`)
		}
	})

	log.info(`listening on port ${port}`)
}