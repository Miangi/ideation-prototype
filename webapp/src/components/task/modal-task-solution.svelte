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
					title: 'Identify the Problem or Need',
					text: 'What specific healthcare problem or need does the elderly population currently face? Your goal in this subtask is to identify the gaps in the current healthcare system targeting this demography. What are major areas of concern that have not been adequately addressed? Define them clearly and concisely.'
				},
				{
					title: 'Your Solution Design',
					text: 'Based on the identified problem or need, what is your solution? Whether it is a novel product or service innovation or a significant improvement of an existing one, what will it look like? Describe your proposed solution, how it works, and why it will be useful.'
				},
				{
					title: 'Market Analysis and Target Audience',
					text: 'Who are your potential customers? You need to identify your target market. What is the size of this market, and who are the key competitors? Describe your target audience is demographics, needs, and problems, including any unique aspects.'
				},
				{
					title: 'Unique Value Proposition',
					text: 'What is your product/services unique advantage over the competition? What makes your solution uniquely suited to the problem or need you have identified for this specific demographic? Explain how your solution creates value sustainably and how you will keep this edge over the future competitors that can emerge within the market.'
				},
			]
		},
		{
			nr: 2,
			questions: [
				{
					title: 'Value Proposition',
					text: 'What is the unique value proposition of your new business model that capitalizes on the shift towards autonomous vehicles? What would your business offer that is different from what is already in the market? Consider the customer is perspective—what problem does your offering solve or what customer needs does it fulfill?'
				},
				{
					title: 'Customer Segments and Relationships',
					text: 'Who are your target customers for this new business model? How do you plan to attract, retain, and deepen the relationship with these customers? How does your business model cater specifically to these customer segments?'
				},
				{
					title: 'Key Resources, Activities, and Partnerships',
					text: 'What key resources and activities are required to deliver your value proposition? What partners will you need to collaborate with to execute your business model effectively?'
				},
				{
					title: 'Revenue Streams and possible costs',
					text: 'How will your business model generate revenue? What is your pricing strategy? Will it have a one-time transaction, subscription model, or a mix? Consider the value customers will receive and how much they will be willing to pay for it. Outline the most important costs that need to be taken into account in the business model.'
				},
			]
		}
	]

	$: task = tasks.find(task => task.nr === $currentTask.number)
	$: submittable = $answers.length == 4 && $answers.every(answer => answer && answer.text.split(/\s+/g).length >= minWordsPerAnswer)
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
		<div class="questions">
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

		>.questions{
			display: flex;
			width: 100%;
			max-height: calc(100vh - 500px);
			overflow-y: auto;
			flex-direction: column;
			margin-top: 15px;
			margin-bottom: 5px;
			margin-left: -8px;
			margin-right: -8px;
			padding: 10px 8px;

			>.line{
				display: flex;
				height: 2px;
				width: 100%;
				background-color: #2E7E66;
				margin-top: 10px;
				margin-bottom: 10px;
			}

			&::-webkit-scrollbar-corner {
				background: none;
			}
			&::-webkit-scrollbar {
				width: 10px;
			}
			&::-webkit-scrollbar-track {
				background: none;
			}
			&::-webkit-scrollbar-thumb {
				background: #888;
				border-radius: 10px;
			}
			&::-webkit-scrollbar-thumb:hover {
				background: #9ca4a9;
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