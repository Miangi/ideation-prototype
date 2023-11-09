import log from '@mwni/log'


export function createGroupController({ meta }){
	let users = []

	return {
		...meta,
		joinUser({ socket, user }){
			let send = payload => socket.send(JSON.stringify(payload))

			users.push({
				...user,
				socket,
				send,
			})

			socket.on('close', code => {
				log.info(`connection from "${user.firstName}" closed (code ${code})`)
				users = users.filter(u => u.socket !== socket)
			})

			send({
				event: 'user',
				user
			})

			log.info(`user "${user.firstName}" joined "${meta.name}"`)
		}
	}
}