import { createServer } from 'http'
import log from '@mwni/log'
import createWss from '@mwni/wss'
import createDBConnection from './database.js'
import { validateUser } from './user.js'
import { createGroupController } from './group.js'

export default ({ port }) => {
	let ctx = {
		db: createDBConnection()
	}

	let groups = []
	let server = createServer()
	let wss = createWss({
		server,
		authorize: async ({ query }) => ({
			user: await validateUser({ ctx, query })
		})
	})

	wss.on('accept', async client => {
		log.info(`new connection from ${client.ip}`)

		let group = groups.find(
			g => g.id === client.user.group.id
		)

		if(!group){
			log.info(`creating group controller for "${client.user.group.name}"`)
			group = createGroupController({ ctx, meta: client.user.group })
			groups.push(group)
		}

		group.joinClient(client)
	})

	wss.on('reject', ({ ip, query }) => {
		log.info(`rejected connection from ${ip} (token ${query.token})`)
	})

	server.listen(port)
	log.info(`listening on port ${port}`)
}