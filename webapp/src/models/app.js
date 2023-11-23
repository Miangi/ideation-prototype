import createSocket from '@mwni/socket'
import { writable, get } from 'svelte/store'
import { visibleModals, lastFinishedTask, unseenContent } from './state.js'
import { goto } from '$app/navigation'


export const connectionState = writable()
export const userMeta = writable()
export const users = writable([])
export const chats = writable([])
export const currentChat = writable()
export const currentTask = writable()
export const answers = writable([])
export const solutionAcceptance = writable([])
export const hiddenChats = writable([])
export const seenChatMessages = writable([])

let socket
let allChats

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
		if(!task){
			goto('/thank-you')
			return
		}
		
		currentTask.set(task)
	})

	socket.on('task-complete', () => {
		lastFinishedTask.set(get(currentTask).number)

		visibleModals.update(
			visible => ({
				...visible,
				taskSolution: false,
				taskFinished: true
			})
		)

		unseenContent.set({
			taskInfo: true,
			taskInstructions: true,
			taskSolution: true
		})
	})

	socket.on('user', ({ user }) => {
		userMeta.set(user)
	})

	socket.on('users', ({ users: u }) => {
		users.set(u)
	})

	socket.on('chats', ({ chats: c }) => {
		allChats = c

		c = c.filter(c => !shouldHideChat(c))

		chats.set(c)

		currentChat.update(
			current => current
				? (
					current.id
						? c.find(c => c.id === get(currentChat).id) || c[0]
						: c[c.length - 1]
				)
				: c[0]
		)
	})

	socket.on('chat', ({ chat }) => {
		allChats = allChats.map(c => c.id === chat.id ? chat: c)

		if(shouldHideChat(chat))
			return

		chats.update(
			chats => allChats.filter(
				c => !shouldHideChat(c)
			)
		)

		if(get(currentChat)?.id === chat.id)
			currentChat.set(chat)
	})

	socket.on('answers', ({ answers: a }) => {
		answers.set(a)
	})

	socket.on('acceptance', ({ acceptance }) => {
		solutionAcceptance.set(acceptance)
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

export function hideChat(chat){
	hiddenChats.update(
		hidden => [...hidden, chat.id]
	)

	chats.update(
		chats => chats.filter(
			c => c.id !== chat.id
		)
	)

	if(get(currentChat).id === chat.id){
		currentChat.set(get(chats).slice(-1)[0])
	}

	flushLocalStorage()
}

export function getChatUnseenMessages(chat){
	let seen = get(seenChatMessages).find(
		seen => seen.id === chat.id
	)

	if(!seen)
		seen = { count: 1 }

	return chat.messages.length - seen.count
}

export function markChatSeen(chat){
	seenChatMessages.update(
		seen => [
			...seen.filter(({ id }) => id !== chat.id),
			{ id: chat.id, count: chat.messages.length }
		]
	)

	flushLocalStorage()
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

export function setAnswerText({ index, text }){
	socket.send({
		command: 'answer',
		index,
		text
	})
}

export function acceptSolution(){
	socket.send({
		command: 'accept'
	})
}

export function submitSolution({ answers }){
	console.log(`submit solution:`, answers)
	socket.send({
		command: 'solution',
		answers
	})
}


function shouldHideChat(chat){
	if(get(hiddenChats).includes(chat.id)){
		console.log(getChatUnseenMessages(chat))
		if(getChatUnseenMessages(chat) <= 0)
			return true
	}

	return false
}

function loadLocalStorage(){
	hiddenChats.set(readLocalStorage('hiddenChats') || [])
	seenChatMessages.set(readLocalStorage('seenChatMessages') || [])
}

function flushLocalStorage(){
	writeLocalStorage('hiddenChats', get(hiddenChats))
	writeLocalStorage('seenChatMessages', get(seenChatMessages))
}

function readLocalStorage(key){
	try{
		return JSON.parse(window.localStorage.getItem(key))
	}catch{
		return null
	}
}

function writeLocalStorage(key, value){
	window.localStorage.setItem(key, JSON.stringify(value))
}

loadLocalStorage()