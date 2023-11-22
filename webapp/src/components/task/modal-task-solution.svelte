<script>
	import MinimizeTaskSolution from '../../assets/svg/minimize_task_solution24px.svelte'
	import WarningIcon from '../../assets/svg/warning_amber_18px.svelte'
	import CloseIcon from '../../assets/svg/close_green_24px.svelte'
	import { visibleModals } from '../../models/state.js'
	import { submitSolution } from '../../models/app'
	import CheckIcon from '../../assets/svg/check_circle_outline_18px.svelte'

	import ConfirmModal from './modal-confirm-task-solution.svelte'

	import Icon from '../../assets/svg/arrow_forward_ios_14px.svelte'

	import { currentTask, userMeta, users } from '../../models/app'

	const minWordsPerAnswer = 30
	const questions1 = [
		"What specific healthcare problem or need does the elderly population currently face? Your goal in this subtask is to identify the gaps in the current healthcare system targeting this demography. What are major areas of concern that have not been adequately addressed? Define them clearly and concisely.",
		"Define Your Solution Design</span><br>Based on the identified problem or need, what's your solution? Whether it's a novel product or service innovation or a significant improvement of an existing one, what will it look like? Describe your proposed solution, how it works, and why it will be useful.",
		"Who are your potential customers? You need to identify your target market. What is the size of this market, and who are the key competitors? Describe your target audience's demographics, needs, and problems, including any unique aspects.",
		"What is your product/service's unique advantage over the competition? What makes your solution uniquely suited to the problem or need you've identified for this specific demographic? Explain how your solution creates value sustainably and how you will keep this edge over the future competitors that can emerge within the market."
	]

	const questions2 = [
		"What is the unique value proposition of your new business model that capitalizes on the shift towards autonomous vehicles? What would your business offer that is different from what's already in the market? Consider the customer's perspective—what problem does your offering solve or what customer needs does it fulfill?",
		"Who are your target customers for this new business model? How do you plan to attract, retain, and deepen the relationship with these customers? How does your business model cater specifically to these customer segments?",
		"What key resources and activities are required to deliver your value proposition? What partners will you need to collaborate with to execute your business model effectively? Also, consider the cost structure and ensure it aligns with your revenue stream.",
		"How will your business model generate revenue? What is your pricing strategy? Will it have a one-time transaction, subscription model, or a mix? Consider the value customers will receive and how much they will be willing to pay for it. Outline the most important costs that need to be taken into account in the business model."
	]


	let currentQuestion = 0
	let validAnswer = false
	let answers = ['', '', '', '']
	let showError = false
	let showFinalPopup = false

	$: showError = !validAnswer


	function handleInput({ target }){
		answers[currentQuestion] = target.value
		validAnswer = answers[currentQuestion].split(' ').length >= minWordsPerAnswer
	}


	function submit(){
		submitSolution({ answers })
		$visibleModals.taskSolution = false
	}


	
	function toggleContentNode(node) {
		node.addEventListener('click', () => {
			let styleProperty = node.nextElementSibling.style.display;
			if (styleProperty === '') styleProperty = 'none';

			node.nextElementSibling.style.display = 
				styleProperty === 'none' ? 'flex' : 'none';
		});
	}


</script>

{#if !showFinalPopup}
	<div class="modal">
		<div class="window">
			<div class="close-button" on:click={() => $visibleModals.taskSolution = false}><MinimizeTaskSolution/></div>
			<div class="ModalLabel">Task Solution Submission</div>
			<div class="solution-summary">
				<div class="collapsible" use:toggleContentNode>Question 1 
					<div class="letters">
						<div class="actual">1</div> / 50 words
					</div>
					<div class="icon"><Icon/></div>
				</div>
				<div class="content">
					<div class="question">
						Question 1 placeholder
					</div>
					<textarea class="solution-input" id="solution-input-1" on:input={handleInput}></textarea>
					<div class="typing-indicator"> 
						...<div class="typing-user">placeholder</div>is typing
					</div>
				</div>
				<div class="line"></div>
				<div class="collapsible" use:toggleContentNode>Question 2
					<div class="letters">
						<div class="actual">1</div> / 50 words
					</div>
					<div class="icon"><Icon/></div>
				</div>
				<div class="content">
					<div class="question">
						Question 2 placeholder
					</div>
					<textarea class="solution-input" id="solution-input-2" on:input={handleInput}></textarea>
					<div class="typing-indicator"> 
						...<div class="typing-user">placeholder</div>is typing
					</div>
				</div>
				<div class="line"></div>
				<div class="collapsible" use:toggleContentNode>Question 3
					<div class="letters">
						<div class="actual">1</div> / 50 words
					</div>
					<div class="icon"><Icon/></div>
				</div>
				<div class="content">
					<div class="question">
						Question 3 placeholder
					</div>
					<textarea class="solution-input" id="solution-input-3" on:input={handleInput}></textarea>
					<div class="typing-indicator"> 
						...<div class="typing-user">placeholder</div>is typing
					</div>
				</div>
				<div class="line"></div>
				<div class="collapsible" use:toggleContentNode>Question 4
					<div class="letters">
						<div class="actual">1</div> / 50 words
					</div>
					<div class="icon"><Icon/></div>
				</div>
				<div class="content">
					<div class="question">
						Question 4 placeholder
					</div>
					<textarea class="solution-input" id="solution-input-4" on:input={handleInput}></textarea>
					<div class="typing-indicator"> 
						...<div class="typing-user">placeholder</div>is typing
					</div>
				</div>
			</div>
													<!-- Hier alle user in Bubble mit Akronym anzeigen -->
			<!---<div class="checker">

				{#if placeholder}
					{#each $users as user}
					<div class="bubble-not-checked" title={`${user.firstName} ${user.lastName}`}>
						{user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase()}
					</div>
					{/each}
				{:else}
					{#each $users as user}
					<div class="bubble-checked" title={`${user.firstName} ${user.lastName}`}>
						{user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase()}
					</div>
					{/each}
				{/if}
	
	
			</div>--->
			<div class="solution-submit" on:click={() => showFinalPopup = true}>Ready to submit!</div> <!-- !!IF: wenn alle bestätigt haben!! -->
			<div class="submitted"><CheckIcon/>Ready!</div>
		</div>
	</div>
{:else}
	<div class="modal">
		<div class="window" on:click|stopPropagation>
			<div class="close" on:click={() => showFinalPopup = false}><CloseIcon/></div>
			<div class="popup-label">Finished?</div>
			<div class="popup-subtitle">By clicking submit, your answer will be saved. After that you can no longer edit your answer and continue with the next task.</div>
			<div class="submit-solution-button" on:click={submit}>Submit Answer</div>
		</div>
	</div>
{/if}

<style lang='scss'>
	.modal{
		display: block;
		position: fixed;
		z-index: 1000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: #12121280;
	}

		.window{
			display: flex;
			z-index: 1100;
			flex-direction: column;
			position: relative;
			background-color: #004A3D;
			color: #34E5B0;
			margin: 15% auto;
			padding: 20px;
			border-radius: 10px;
			width: 600px;
			top: -200px;
			font-size: 16px;

					>.close-button { /* this only styles position i think*/
						display: flex;
						color: #aaa;
						float: right;
						font-size: 24px;
						font-weight: bold;
						margin-left: auto;
						cursor: pointer;
					}

					>.ModalLabel{
						display: flex;
						font-size: 24px;
						font-family: 'Ubuntu Bold';
					}


					>.solution-summary{
					display: flex;
					width: 100%;
					flex-direction: column;
					margin-top: 15px;
					margin-bottom: 15px;


						>.collapsible{
							display: flex;
							font-size: 16px;
							font-family: 'Ubuntu Bold';
							width: 100%;
							cursor: pointer;
							align-items: center;

							>.icon{
								margin-right: 3px;
								margin-left: 10px;
							}

							>.letters{
								display: flex;
								gap: 3px;
								margin-left: auto;
								color: #FF7878;
							}
						}

						>.content{
							display: none;
							overflow: hidden;
							flex-direction: column;

								>.solution-input{
									display: flex;
									width: 100%;
									height: 100px;
									min-height: 70px;
									max-height: 120px;
									background-color: #033129;
									border-radius: 10px;
									padding-top: 5px;
									padding-left: 5px;
									padding-right: 5px;
									box-sizing: border-box;
									overflow: scroll;
									outline: none;
									border: none;
									resize: none;
									color: #34E5B0;
									margin-top: 10px;
									margin-bottom: 5px;
								}


							>.question{
								margin-top: 5px;
							}

							>.typing-indicator{
								display: flex;
								gap: 3px;
								margin-left: auto;
								margin-right: 3px;
								margin-top: 3px;
								color: #9CA4A9;
							}
						}

						>.checker{
							display: flex;
							gap: 10px;
							justify-content: center;

								>.bubble-not-checked{
									display: flex;
									align-items: center;
									justify-content: center;
									width: 30px;
									height: 30px;
									border-radius: 100px;
									background-color: #242424;
									color: #939393;
									font-size: 12px;
									cursor: default;
								}

								>.bubble-checked{
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
						}

						>.line{
							display: flex;
							height: 2px;
							width: 100%;
							background-color: #2E7E66;
							margin-top: 10px;
							margin-bottom: 10px;
						}
					}


					.solution-submit{
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
							cursor: wait;
							align-items: center;
							gap: 5px;
							justify-content: center;
						}

		}


 
		.close{
			display: flex;
			margin-left: auto;
			cursor: pointer;
		}

		.popup-label{
			display: flex;
			font-size: 24px;
			align-self: center;
			margin-bottom: 5px;
			font-family: 'Ubuntu Bold'
		}
	
		.popup-subtitle{
			display: flex;
			text-align: center;
		}

		.submit-solution-button{
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
		}

::-webkit-scrollbar-corner {
	background: none;
}

::-webkit-scrollbar {
	width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
	background: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #9ca4a9;
}

</style>