import { WebSocketServer } from 'ws'
import log from '@mwni/log'

export default ({ port }) => {
	let server = new WebSocketServer({
		port
	})

	server.on('connection', (socket, request) => {
		let ip = request.socket.remoteAddress
		log.info(`new connection from ${ip}`)

		socket.on('close', code => {
			log.info(`connection to ${ip} closed (code ${code})`)
		})
	})

	log.info(`listening on port ${port}`)
}