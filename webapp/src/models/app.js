import createSocket from '@mwni/socket'
import { writable } from 'svelte/store'


export const connectionState = writable()
export const currentChat = writable()
export const userMeta = writable()

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
}

export function submitSolution({ answers }){
	console.log(`submit solution:`, answers)
}

currentChat.set({
	experts: undefined
})