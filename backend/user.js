import { parse as parseURL } from 'url'
import { parse as parseQuery } from 'querystring'


export async function validateUser({ ctx, socket, request }){
	let query = parseQuery(parseURL(request.url).query)
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