export function initApi({ ctx: serverCtx, router }){
	router.get('/check-code', async ctx => {
		let team = await serverCtx.db.teams.readOne({
			where: {
				code: ctx.query.code
			}
		})

		ctx.body = {
			valid: !!team
		}
	})

	router.get('/check-token', async ctx => {
		let user = await serverCtx.db.users.readOne({
			where: {
				token: ctx.query.token
			}
		})

		ctx.body = {
			valid: !!user
		}
	})

	router.post('/register', async ctx => {
		let { code, surname: firstName, name: lastName, email } = ctx.request.body
		let team = await serverCtx.db.teams.readOne({
			where: {
				code
			}
		})

		if(!team){
			ctx.status = 400
			ctx.body = {
				message: 'Invalid Code'
			}
			return
		}

		// this is not secure, but we ballin
		let token = Math.random()
			.toString(16)
			.slice(2, 10)
			.toUpperCase()

		await serverCtx.db.users.createOne({
			data: {
				team,
				token,
				firstName,
				lastName,
				email
			}
		})

		ctx.body = {
			token
		}
	})
}