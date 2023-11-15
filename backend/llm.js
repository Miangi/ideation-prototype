import log from '@mwni/log'
import OpenAI from 'openai'

const openai = new OpenAI({
	apiKey: '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'
})

export async function queryLLM({ model='gpt-4', system, messages, preface, stop, stream }){
	let thread = new LLMThread(...messages)
	let llmMessages = thread.forQuery({ system, preface })

	log.time.debug('llm.query', `querying ${model}`)

	let completion = await openai.chat.completions.create({
		model,
		messages: llmMessages,
		temperature: 0,
		stop,
		stream,
	})

	if(stream){
		async function* iterate(){
			for await (const chunk of completion){
				let text = chunk.choices[0]?.delta?.content || ''

				if(text.length === 0)
					continue

				thread.appendStreamingDelta(text)

				yield thread
			}

			log.time.debug('llm.query', `querying ${model} took %`)
		}
		return iterate()
	}else{
		console.log(stop, completion.choices[0])
		thread.appendResult((preface || '') + completion.choices[0].message.content)
		log.time.debug('llm.query', `querying ${model} took %`)
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