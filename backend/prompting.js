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

export async function generateExperts({ ctx, problem }){
	
}