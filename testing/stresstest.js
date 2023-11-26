import { post } from '@mwni/fetch'
import logging from '@mwni/log'
import { WebSocket } from 'ws'

const membersPerTeam = 3
const teamCodes = [
	'3I58L',
	'1PRBH',
	'T842T',
	'P95QD',
	'1X6FL',
	'ICQXO',
	'LAXL0',
	'ZYV97',
	'Y8ATI',
	'N01ZQ',
	'9KZWD',
	'K07XH',
	'72JJO',
	'F6N57',
	'KV933',
]
const cases = [
	{
		problem: 'We are trying to find a product/service innovation within the area of circular economies.',
		question: 'What are the areas that have the biggest potential to switch to a circular economy?'
	},
	{
		problem: 'We are trying to find a product/service innovation within the area of circular economies.',
		question: 'Give me a summary of the XRP market in terms of marketing'
	},
	{
		problem: 'We want to create a business model innovation within the aviation industry in the future. flying cars like lillium will enable personal areal transportation. We want to create a smart business model that leverages flying cars in the future.',
		question: 'what might be the value proposition of such a venture?'
	}
]


async function runTeamSimulation(code){
	let log = logging.fork({ name: `team-${code}` })
	let { problem, question } = cases[Math.floor(Math.random() * 3)]

	log.info(`starting simulation`)

	let tokens = []

	await wait(3000 * Math.random())

	for(let i=0; i<membersPerTeam; i++){
		let { token } = await post({
			url: 'https://study.pivoto.ai/api/register',
			payload: {
				code, 
				surname: 'John', 
				name: 'Doe', 
				email: 'john@example.com'
			}
		})

		tokens.push(token)
		log.info(`created user`)
	}

	let sockets = []
	let chats = []

	for(let token of tokens){
		let socket = new WebSocket(`wss://study.pivoto.ai/api?token=${token}`)

		socket.on('open', () => {
			log.info(`user ${token} connected`)
		})

		socket.on('message', data => {
			let payload = JSON.parse(data)

			log.info(`user ${token} received:`, payload)

			if(payload.event === 'chats')
				chats = payload.chats
		})

		sockets.push(socket)
	}

	await wait(5000 + 5000 * Math.random())

	await simulateChatInput({ 
		socket: sockets[Math.floor(Math.random() * sockets.length)], 
		chatId: chats[0].id,
		text: problem
	})

	await wait(8000 + 15000 * Math.random())

	await simulateChatInput({ 
		socket: sockets[Math.floor(Math.random() * sockets.length)], 
		chatId: chats[0].id,
		text: question
	})

	await wait(10000)

	log.info('simulation complete')

	for(let socket of sockets){
		socket.close()
	}
}

async function simulateChatInput({ socket, chatId, text }){
	let typingSpeed = 50 + 300 * Math.random()

	for(let i=1; i<text.length; i++){
		socket.send(JSON.stringify({
			command: 'type',
			chat: chatId,
			text: text.slice(0, i)
		}))

		await wait(typingSpeed)
	}

	socket.send(JSON.stringify({
		command: 'reply',
		chat: chatId,
		text: text
	}))
}

async function wait(ms){
	await new Promise(resolve => setTimeout(resolve, ms))
}

await Promise.all(
	teamCodes.map(
		code => runTeamSimulation(code)
	)
)