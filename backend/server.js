import { createServer } from 'http'
import log from '@mwni/log'
import Koa from 'koa'
import KoaRouter from '@koa/router'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-bodyparser'
import createWss from '@mwni/wss'
import createDBConnection from './database.js'
import { validateUser } from './user.js'
import { initApi } from './api.js'
import { createTeamSession } from './session.js'

export default async ({ port }) => {
	let ctx = {
		db: createDBConnection(),
		sessions: []
	}

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

		let session = ctx.sessions.find(
			g => g.id === client.user.team.id
		)

		if(!session){
			log.warn(`no team session exists for user "${client.user.firstName}"`)
			return
		}

		session.joinClient(client)
	})

	wss.on('reject', ({ ip, query }) => {
		log.info(`rejected connection from ${ip} (token ${query.token})`)
	})

	for(let team of await ctx.db.teams.readMany()){
		ctx.sessions.push(await createTeamSession({ ctx, team }))
	}

	server.listen(port)
	log.info(`listening on port ${port}`)
}