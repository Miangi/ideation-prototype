import createSocket from '@mwni/socket'
import { writable, get } from 'svelte/store'


export const connectionState = writable()
export const userMeta = writable()
export const users = writable([])
export const chats = writable([])
export const currentChat = writable()

let socket

export function connect({ url }){
	socket = createSocket({ url })

	socket.on('connect', () => {
		console.log('connection to backend established')
		connectionState.set('connected')
	})

	socket.on('disconnect', () => {
		console.warn('connection to backend lost')
		connectionState.set('lost')
	})

	socket.on('user', ({ user }) => {
		userMeta.set(user)
	})

	socket.on('users', ({ users: u }) => {
		users.set(u)
	})

	socket.on('chats', ({ chats: c }) => {
		chats.set(c)

		if(get(currentChat)){
			currentChat.set(c.find(c => c.id === get(currentChat).id))
		}else{
			currentChat.set(c[0])
		}
	})

	socket.on('chat', ({ chat }) => {
		chats.update(chats => chats.map(c => c.id === chat.id ? chat: c))

		if(get(currentChat).id === chat)
			currentChat.set(chat)
	})
}

export function setChatInput(text){
	text = text.trim()

	socket.send({
		command: 'type',
		chat: get(currentChat).id,
		text
	})
}

export function submitSolution({ answers }){
	console.log(`submit solution:`, answers)
}