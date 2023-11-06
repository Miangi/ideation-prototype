import createSocket from '@mwni/socket'
import { createEmitter } from '@mwni/events'

export default class extends createEmitter{
	constructor({ backendUrl }){
		super()
		this.socket = createSocket({ url: backendUrl })
	}
}