import { WebSocketServer } from 'ws'
import log from '@mwni/log'
import { createSession } from './session.js'

export default ({ port }) => {
	let ctx = {}
	let sessions = []
	let server = new WebSocketServer({
		port
	})

	server.on('connection', async (socket, request) => {
		let ip = request.socket.remoteAddress

		log.info(`new connection from ${ip}`)

		let session = await createSession({ ctx, socket, request })

		sessions.push(session)

		socket.on('close', code => {
			log.info(`connection to ${ip} closed (code ${code})`)
			session.close()
			sessions = sessions.filter(s => s !== session)
		})
	})

	log.info(`listening on port ${port}`)

	return () => {
		log.info(`shutting down`)

		for(let session of sessions){
			session.close()
		}

		server.close()
	}
}