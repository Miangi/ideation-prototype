import log from '@mwni/log'
import OpenAI from 'openai'

const openai = new OpenAI({
	apiKey: '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'
})

export async function queryLLM({ model='gpt-4', system, messages, preface, stop, stream }){
	let thread = new LLMThread(...messages)
	let llmMessages = thread.forQuery({ system, preface })
	let xid = Math.random()

	log.time.debug(`llm.query${xid}`, `querying ${model}`)
	
	if(stream){
		let attempts = 0
		let queue = []
		let done = false

		async function stream(){
			let currentThread = new LLMThread(...thread)
			let completion = await openai.chat.completions.create({
				model,
				messages: llmMessages,
				temperature: 0,
				stop,
				stream: true,
			})

			let bricked = false
			let brick = () => {
				bricked = true

				if(++attempts >= 3){
					log.warn(`chat streaming timed out after 5s - giving up`)
					done = true
				}else{
					log.warn(`chat streaming timed out after 5s - retrying (attempt #${attempts})`)
					stream()
				}
			}

			let timeout = setTimeout(brick, 5000)

			for await (const chunk of completion){
				if(bricked)
					return

				clearTimeout(timeout)
				timeout = setTimeout(brick, 5000)

				let text = chunk.choices[0]?.delta?.content || ''
	
				if(text.length === 0)
					continue
	
				currentThread.appendStreamingDelta(text)
	
				queue.push(currentThread)
			}

			clearTimeout(timeout)
			done = true
		}

		async function* iterate(){
			while(true){
				if(queue.length > 0){
					yield queue.shift()
				}else if(done){
					log.time.debug(`llm.query${xid}`, `querying ${model} took %`)
					return
				}else{
					await new Promise(resolve => setTimeout(resolve, 10))
				}
			}
		}

		stream()

		return iterate()
	}else{
		let completion = await openai.chat.completions.create({
			model,
			messages: llmMessages,
			temperature: 0,
			stop,
			stream: false,
		})

		thread.appendResult((preface || '') + completion.choices[0].message.content)
		log.time.debug(`llm.query${xid}`, `querying ${model} took %`)
		return thread
	}
}

export function formatChoices({ choices }){
	return Object.entries(choices)
		.map(([key, desc]) => `${key}) ${desc}`)
		.join('\n')
}

export function parseChoice({ choices, text }){
	return Object.keys(choices)
		.map(key => ({ key, pos: text.indexOf(key) }))
		.filter(({ pos }) => pos >= 0)
		.sort((a, b) => a.pos - b.pos)
		[0]?.key
}

export class LLMThread extends Array{
	constructor(...messages){
		if(typeof messages[0] === 'number')
			return new Array(messages[0])

		super(...messages.map(Message.from))
	}

	get last(){
		return this[this.length - 1]
	}

	forQuery({ system, preface }){
		let messages = this.map(message => message.toRole())

		if(system)
			messages.unshift({ role: 'system', content: system })

		if(preface)
			messages.push({ role: 'assistant', content: preface })

		return messages
	}

	appendResult(result){
		this.push(new Message({ assistant: result }))
	}

	appendStreamingDelta(delta){
		let text = ''

		if(this.last.role === 'assistant'){
			text = this.last.toString()
			this.pop()
		}

		this.appendResult(text + delta)
	}
}

class Message extends String{
	static from(value){
		if(value instanceof Message)
			return value

		return new Message(value)
	}

	constructor({ user, assistant }){
		if(user){
			super(user)
			this.role = 'user'
		}else if(assistant){
			if(typeof assistant === 'string' || !assistant.preface)
				super(assistant)
			else{
				super(assistant.preface + assistant.result)
				this.preface = assistant.preface
				this.withoutPreface = assistant.result.trim()
			}
			this.role = 'assistant'
		}else{
			throw new Error(`Message must be constructed with either "user" or "assistant" string`)
		}
	}

	toRole(){
		return {
			role: this.role,
			content: this.toString()
		}
	}
}