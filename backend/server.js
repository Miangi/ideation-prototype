import { createServer } from 'http'
import log from '@mwni/log'
import Koa from 'koa'
import KoaRouter from '@koa/router'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-bodyparser'
import createWss from '@mwni/wss'
import createDBConnection from './database.js'
import { validateUser } from './user.js'
import { createTeamController } from './team.js'
import { initApi } from './api.js'

export default ({ port }) => {
	let ctx = {
		db: createDBConnection()
	}

	let teams = []
	let koa = new Koa()
	let router = new KoaRouter()
	let server = createServer(koa.callback())
	let wss = createWss({
		server,
		authorize: async ({ query }) => ({
			user: await validateUser({ ctx, query })
		})
	})

	initApi({ ctx, router })

	koa.use(KoaCors())
	koa.use(KoaBody())
	koa.use(
		router.routes(), 
		router.allowedMethods()
	)

	wss.on('accept', async client => {
		log.info(`new connection from ${client.ip}`)

		let team = teams.find(
			g => g.id === client.user.team.id
		)

		if(!team){
			log.info(`creating team controller for "${client.user.team.name}"`)
			team = createTeamController({ ctx, meta: client.user.team })
			teams.push(team)
		}

		team.joinClient(client)
	})

	wss.on('reject', ({ ip, query }) => {
		log.info(`rejected connection from ${ip} (token ${query.token})`)
	})

	server.listen(port)
	log.info(`listening on port ${port}`)
}