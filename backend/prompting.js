import { formatChoices, parseChoice, queryLLM } from './llm.js'
import prompts from './prompts.js'

export async function validateProblem({ ctx, problem }){
	let result = await queryLLM({
		system: prompts.validate_problem.system,
		messages: [{
			user: prompts.validate_problem.prompt.format({ 
				problem,
				choices: formatChoices({ 
					choices: prompts.validate_problem.choices 
				})
			})
		}],
		stream: false
	})

	let choice = parseChoice({
		choices: prompts.validate_problem.choices,
		text: result.last
	})

	return choice === 'A'
}

export async function validateMessage({ ctx, chat }){
	let result = await queryLLM({
		system: prompts.validate_message.system.format({
			problem: chat.problemDescription
		}),
		messages: [{
			user: prompts.validate_message.prompt.format({
				transscript: compileTransscript(chat),
				choices: formatChoices({ 
					choices: prompts.validate_message.choices 
				})
			})
		}],
		stream: false
	})

	console.log(result)

	let choice = parseChoice({
		choices: prompts.validate_message.choices,
		text: result.last
	})

	return choice === 'A'
}

export async function summarizeProblem({ ctx, problem }){
	let result = await queryLLM({
		system: prompts.summarize_problem.system,
		messages: [{
			user: prompts.summarize_problem.prompt.format({ 
				problem
			})
		}],
		preface: prompts.summarize_problem.preface,
		stream: false
	})

	let match = /(?:Title:\s*)(.*)(?:\n*)(?:Summary:\s*)(.*)/g.exec(result.last)

	return {
		title: match[1].trim(),
		summary: match[2].trim()
	}
}

export async function* generateExperts({ ctx, problem }){
	let stream = await queryLLM({
		system: prompts.generate_experts.system,
		messages: [{
			user: prompts.generate_experts.prompt.format({ 
				problem
			})
		}],
		stream: true
	})

	for await(let result of stream){
		yield parseExperts(result.last.toString())
	}
}

function parseExperts(text){
	let segments = text.split('\n\n')
	
	return segments.map(
		(segment, index) => {
			let firstLineBreak = segment.indexOf('\n')

			if(firstLineBreak > 0){
				return {
					index,
					name: segment.slice(0, firstLineBreak).slice(2).trim(),
					background: segment.slice(firstLineBreak+1).trim().replaceAll(/(^")|("$)/g, '')
				}
			}else{
				return {
					index,
					name: segment.slice(2).trim(),
					background: ''
				}
			}
		}
	)
}

function compileTransscript(chat){
	return getValidSessionMessages(chat)
		.map(
			message => message.user
				? `User (${message.user.firstName}):\n${message.text}`
				: `${message.expert.name}:\n${message.text}`
		)
		.join('\n\n')
}

function getValidSessionMessages(chat){
	let expertsIndex = chat.messages.findIndex(
		message => message.text === '(experts)'
	)

	return chat.messages
		.slice(expertsIndex + 1)
		.filter(message => message.expert || (message.user && message.valid !== false))
}