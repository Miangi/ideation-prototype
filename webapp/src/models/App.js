import createSocket from '@mwni/socket'
import { createEmitter } from '@mwni/events'

export default class{
	constructor({ backendUrl }){
		Object.assign(this, createEmitter())
		
		this.socket = createSocket({ url: backendUrl })
		this.socket.on('connect', this.onConnect.bind(this))
		this.socket.on('disconnect', this.onDisconnect.bind(this))
	}

	onConnect(){
		console.log('connection to backend established')
	}

	onDisconnect(){
		console.warn('connection to backend lost')
	}
}