import { parse as parseURL } from 'url'
import { parse as parseQuery } from 'querystring'


export async function createSession({ ctx, socket, request }){
	let query = parseQuery(parseURL(request.url).query)
	let userToken = query.token

	console.log(userToken)

	return {
		close(){
			socket.close()
		}
	}
}