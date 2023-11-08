import log from '@mwni/log'


export function createGroupController({ meta }){
	let users = []

	return {
		...meta,
		joinUser({ socket, user }){
			users.push({
				...user,
				socket
			})

			socket.on('close', code => {
				log.info(`connection from "${user.name}" closed (code ${code})`)
				users = users.filter(u => u.socket !== socket)
			})

			log.info(`user "${user.name}" joined "${meta.name}"`)
		}
	}
}