export function initApi({ ctx: serverCtx, router }){
	router.get('/check-code', async ctx => {
		let group = await serverCtx.db.groups.readOne({
			where: {
				code: ctx.query.code
			}
		})

		ctx.body = {
			valid: !!group
		}
	})

	router.post('/register', async ctx => {
		let { code, surname: firstName, name: lastName, email } = ctx.request.body
		let group = await serverCtx.db.groups.readOne({
			where: {
				code
			}
		})

		if(!group){
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
				group,
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