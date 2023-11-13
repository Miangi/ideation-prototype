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

	console.log(result.last)

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