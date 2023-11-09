export async function validateUser({ ctx, query }){
	let userToken = query.token
	let user = await ctx.db.users.readOne({
		where: {
			token: userToken
		},
		include: {
			group: true
		}
	})

	if(!user)
		throw { message: `invalid user token (${userToken})` }

	return user
}