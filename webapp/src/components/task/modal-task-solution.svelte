<script>
	import CloseIcon from '../../assets/svg/close_green_24px.svelte'
	import CheckIcon from '../../assets/svg/check_circle_outline_18px.svelte'

	import { visibleModals } from '../../models/state.js'
	import { acceptSolution, answers, currentTask, solutionAcceptance, userMeta, users } from '../../models/app.js'
    import AnswerAccord from './answer-accord.svelte'

	const minWordsPerAnswer = 30
	const tasks = [
		{
			nr: 1,
			questions: [
				{
					title: 'Challenges',
					text: 'What are some common problems or challenges faced by the aging population that your product aims to solve?'
				},
				{
					title: 'Product',
					text: 'What is your proposed product or service? Describe its functionality and how it helps the elderly in detail.'
				},
				{
					title: 'Goals',
					text: 'How does your product or service improve upon or differ from existing solutions in the market?'
				},
				{
					title: 'Feasibility',
					text: 'What is the feasibility of implementing your product? Consider factors such as cost, risk, and complexity.'
				},
			]
		},
		{
			nr: 2,
			questions: [
				{
					title: 'Uniqueness',
					text: 'What is the unique value proposition of your new business model that capitalizes on the shift towards autonomous vehicles? What would your business offer that is different from what\'s already in the market? Consider the customer\'s perspective. What problem does your offering solve or what customer needs does it fulfill?'
				},
				{
					title: 'Audience',
					text: 'Who are your target customers for this new business model? How do you plan to attract, retain, and deepen the relationship with these customers? How does your business model cater specifically to these customer segments?'
				},
				{
					title: 'Resources',
					text: 'What key resources and activities are required to deliver your value proposition? What partners will you need to collaborate with to execute your business model effectively? Also, consider the cost structure and ensure it aligns with your revenue stream.'
				},
				{
					title: 'Revenue',
					text: 'How will your business model generate revenue? What is your pricing strategy? Will it have a one-time transaction, subscription model, or a mix? Consider the value customers will receive and how much they will be willing to pay for it. Outline the most important costs that need to be taken into account in the business model.'
				},
			]
		}
	]

	$: task = tasks.find(task => task.nr === $currentTask.number)
	$: submittable = $answers.length == 4 && $answers.every(answer => answer && answer.text.split(/ +/g).length >= minWordsPerAnswer)
</script>

<div class="modal">
	<div class="window">
		<div class="close" on:click={() => $visibleModals.taskSolution = false}>
			<CloseIcon/>
		</div>
		<div class="label">Task Solution</div>
		<div class="subtitle">
			By clicking submit, your answers will be saved. After that you can no longer edit your answers and you will continue with the next task.
		</div>
		<div class="solution-summary">
			{#each task.questions as question, index}
				{#if index > 0}
					<div class="line"/>
				{/if}
				<AnswerAccord 
					question={question} 
					index={index}
					minWords={minWordsPerAnswer}
				/>
			{/each}
		</div>
		<div class="acceptance">
			{#each $users as user}
				{#if $solutionAcceptance.some(a => a.id === user.id)}
					<div class="bubble" title={`${user.firstName} ${user.lastName}`}>
						{user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase()}
					</div>
				{:else}
					<div class="placeholder" title={`${user.firstName} ${user.lastName}`}/>
				{/if}
			{/each}
		</div>
		{#if $solutionAcceptance.every(a => a.id !== $userMeta.id)}
			<div class={`submit ${!submittable && 'disabled'}`} on:click={acceptSolution}>Looks good!</div>
		{:else}
			<div class="submitted">
				<CheckIcon/>
				Waiting for all team members
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.modal{
		display: block;
		position: absolute;
		z-index: 1800;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow:hidden;
		background: #12121295;

	>.window{
		display: flex;
		flex-direction: column;
		position: relative;
		background-color: #004A3D;
		color: #34E5B0;
		margin: 5% auto;
		padding: 20px;
		border-radius: 10px;
		width: 515px;

		>.close{
			display: flex;
			margin-left: auto;
			cursor: pointer;
		}


		>.label{
			display: flex;
			font-size: 24px;
			align-self: center;
			margin-bottom: 5px;
			font-family: 'Ubuntu Bold'
		}

		>.subtitle{
			display: flex;
			text-align: center;
		}

		>.solution-summary{
			display: flex;
			width: 100%;
			flex-direction: column;
			margin-top: 25px;
			margin-bottom: 15px;

			>.line{
				display: flex;
				height: 2px;
				width: 100%;
				background-color: #2E7E66;
				margin-top: 10px;
				margin-bottom: 10px;
			}
		}

		>.acceptance{
			display: flex;
			justify-content: center;
			gap: 8px;

			.bubble{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30px;
				height: 30px;
				border-radius: 100px;
				background-color: #4FDB8F;
				color: #004A3D;
				font-size: 12px;
				cursor: default;     
			}

			.placeholder{
				width: 30px;
				height: 30px;
				border-radius: 100px;
				border: dashed 1px #2eaf89;  
			}
		}

		>.submit{
			display: flex;
			width: 100%;
			height: 44px;
			padding: 15px;
			box-sizing: border-box;
			background: #34E5B0;
			color:#033129;
			align-self: center;
			margin-top: 25px;
			border-radius: 5px;
			cursor: pointer;
			align-items: center;
			gap: 5px;
			justify-content: center;

			&:active{
				opacity: 0.7;
			}

			&.disabled{
				pointer-events: none;
				opacity: 0.5;
			}
		}

		>.submitted{
			display: flex;
			width: 100%;
			height: 44px;
			padding: 15px;
			box-sizing: border-box;
			background: transparent;
			color:#34E5B0;
			border: solid 1px #34E5B0; 
			align-self: center;
			margin-top: 25px;
			border-radius: 5px;
			align-items: center;
			gap: 5px;
			justify-content: center;
		}
	}
}
</style>