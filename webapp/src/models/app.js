import createSocket from '@mwni/socket'
import { writable, get } from 'svelte/store'


export const connectionState = writable()
export const userMeta = writable()
export const users = writable([])
export const chats = writable([])
export const currentChat = writable()
export const currentTask = writable()

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

	socket.on('task', ({ task }) => {
		currentTask.set(task)
	})

	socket.on('user', ({ user }) => {
		userMeta.set(user)
	})

	socket.on('users', ({ users: u }) => {
		users.set(u)
	})

	socket.on('chats', ({ chats: c }) => {
		chats.set(c)

		currentChat.update(
			current => current
				? (
					current.id
						? c.find(c => c.id === get(currentChat).id)
						: c[c.length - 1]
				)
				: c[0]
		)
	})

	socket.on('chat', ({ chat }) => {
		chats.update(chats => chats.map(c => c.id === chat.id ? chat: c))

		if(get(currentChat)?.id === chat.id)
			currentChat.set(chat)
	})
}

export function createNewChat(){
	let tentativeChat = {
		title: `Ideation ${get(chats).length + 1}`,
		experts: [],
		messages: [],
		typingUsers: {}
	}

	chats.update(chats => [...chats, tentativeChat])
	currentChat.set(tentativeChat)

	socket.send({ command: 'new_chat' })
}

export function selectChat(chat){
	currentChat.set(
		get(chats).find(
			c => c.id === chat.id
		)
	)
}

export function setChatInput(text){
	text = text.trim()

	socket.send({
		command: 'type',
		chat: get(currentChat).id,
		text: text.length > 0 ? text : null
	})
}

export function submitChatInput(text){
	text = text.trim()

	if(text.length === 0)
		return

	socket.send({
		command: 'reply',
		chat: get(currentChat).id,
		text
	})
}

export function submitSolution({ answers }){
	console.log(`submit solution:`, answers)
	socket.send({
		command: 'solution',
		answers
	})
}