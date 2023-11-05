<script lang="ts">
	import Avatar from './avatar.svelte';
	import AvatarInSelection from './avatar_selection.svelte';

	import AddIcon from '../svg/add_24px.svelte';
	import AddPersona from '../svg/add_persona_24px.svelte';

	import CloseTabIcon from '../svg/close_inactive_tab_18px.svelte';
	import CloseActiveTabIcon from '../svg/close_tab_18px.svelte';
	import AddTabIcon from '../svg/add_tab_18px.svelte';
	import CloseIcon from '../svg/close_green_24px.svelte';


	import TaskInfoUnclicked from '../svg/taskinfo_notification.svelte';
	import TaskInfoClicked from '../svg/task-info-clicked.svelte';
	import MinimizeTaskInfo from '../svg/minimize_task_info24px.svelte';
	import WarningIcon from '../svg/warning_amber_18px.svelte';

	import TaskUnclicked from '../svg/task_notofication.svelte';
	import TaskClicked from '../svg/task-clicked.svelte';
	import MinimizeTask from '../svg/minimize_task_24px.svelte';

	import TaskSolutionUnclicked from '../svg/tasksolution_notification.svelte';
	import TaskSolutionClicked from '../svg/task-solution-clicked.svelte';
	import MinimizeTaskSolution from '../svg/minimize_task_solution24px.svelte';
	import CheckIcon from '../svg/check_circle_outline_16px.svelte'

	import AddProblemSecondary from '../svg/add_problem_circle_outlined_12px.svelte'
	import AddPersonaSecondary from '../svg/add_ai_circle_outlined_12px.svelte'

	import SendIconInactive from '../svg/send_icon_inactive.svelte'
	import SendIconActive from '../svg/send_icon_active.svelte'

	import ShuffleAiAvatars from '../svg/shuffle-ai-avatar.svelte';

//tab management
let tabs = [{ id: 1, title: 'Ideation 1'}];
let activeTab = tabs[0];

function addTab() {
const id = Math.random()
 .toString(16)
 .slice(2, 10)
 .toUpperCase()

  const newTab = { id, title: `Ideation` };
  tabs = [...tabs, newTab];
  activeTab = newTab;
}


function removeTab(id: number) {
  tabs = tabs.filter(tab => tab.id !== id);
  if (activeTab.id === id) {
    activeTab = tabs[0] || {};
  }
}

function selectTab(tab: {id: number, title: string}) {
  activeTab = tab;
}


//implementation functions to handle the info, task and solution modals on the right side

import { writable } from 'svelte/store';

let isClickedinfo = writable(false);
let isClickedtask = writable(false);
let isClickedsolution = writable(false);
let isClickedSolutionPopup = writable(false);

let modalOpenInfo = writable(false);
let modalOpenTask = writable(false);
let modalOpenSolution = writable(false);
let modalSolutionPopup = writable(false);

function handleClickSolutionPopup() {
	if (!validAnswer) {
        return;
    }
	
	isClickedSolutionPopup.set(true);
	modalSolutionPopup.set(true);
};

function handleClickinfo() {
  isClickedinfo.set(true);
  modalOpenInfo.set(true);
};
function handleClicktask() {
	isClickedtask.set(true);
	modalOpenTask.set(true);
};
function handleClicksolution() {
	isClickedsolution.set(true);
	modalOpenSolution.set(true);
};

function handleCloseSolutionPopup () {
	modalSolutionPopup.set(false);
};

function handleCloseModalInfo () {
	modalOpenInfo.set(false);
};

function handleCloseModalTask () {
	modalOpenTask.set(false);
};

function handleCloseModalSolution () {
	modalOpenSolution.set(false);
};


//implementation of adding a problem description

let isClickedProblem = writable(false);
let modalOpenProblem = writable(false);

function handleClickProblem() {
	isClickedProblem.set(true);
	modalOpenProblem.set(true);
};

function handleCloseModalProblem () {
	modalOpenProblem.set(false);

};

let problemDescription = ""
  let activeProblem = ""

  const handleSubmit = () => {
    activeProblem = problemDescription;
	modalOpenProblem.set(false);
  };

  //implementation of solution container for task 1

  import { goto } from '$app/navigation';

let currentQuestion = 0
let validAnswer = false;
let answers = ["", "", "", ""];
const questions = [
    'What are some common problems or challenges faced by the aging population that your product aims to solve?',
    'What is your proposed product or service? Describe its functionality and how it helps the elderly in detail.',
    'How does your product or service improve upon or differ from existing solutions in the market?',
    'What is the feasibility of implementing your product? Consider factors such as cost, risk, and complexity.'
];
let showError = false;
$: showError = !validAnswer;

// Function to handle the next button
function nextQuestion() {
    if (validAnswer) {
        currentQuestion += 1;
    }
}
// Function to handle the back button
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion -= 1;
    }
}
// Function to handle the textarea input
function handleInput({ target }) {
    answers[currentQuestion] = target.value;
    validAnswer = answers[currentQuestion].split(' ').length >= 50;
}
// Function to submit the answers
function submitAnswers() {
    if (!validAnswer) {
        return;
    }

    modalSolutionPopup.set(false);
    goto('/ideation-task-2');

    console.log(answers);

}

  //implementation AI persona modal
  	let isClickedAvatar = writable(false);
	let modalOpenAvatar = writable(false);

	function handleClickAvatar() {
		isClickedAvatar.set(true);
		modalOpenAvatar.set(true);
};


function handleAvatarSubmit () {
	modalOpenAvatar.set(false);
};

  //implementation Chat

  import { onMount, tick } from 'svelte';

let messageInput = ""; 
let messageId = 0;
const messages = writable([]);
	
let chatContainer; 

// Uncomment below code if we have getResponseFromGPT4 function
/*
let botResponse = async(text) => {
	let response = await getResponseFromGPT4(text);
	messages.update(curr => [...curr, { text: response, sender: 'bot', id: messageId }]);
}
*/

let sendMessage = () => {
	messageId++;
	messages.update(curr => [...curr, { text: messageInput, sender: 'user', id: messageId }]);
	// botResponse(messageInput); Uncomment code if we have getResponseFromGPT4 function
	messageInput = "";

	// Scroll to the newest message after sending
	setTimeout(() => {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}, 0);
};

// Reactive statement for scrolling to the newest message > doesn't work somehow


</script>

<div class="background-container-app">
	<div class="container-app">
								{#if $modalSolutionPopup}
								<div class="modal-task-soltuion-popup">
									<div class="modal-task-soltuion-popup-content" on:click|stopPropagation>
										<div class="modal-task-soltuion-close" on:click={handleCloseSolutionPopup}><CloseIcon/></div>
										<div class="modal-task-soltuion-popup-label">Finished?</div>
										<div class="modal-task-soltuion-popup-subtitle">By clicking submit, your answer will be saved. After that you can no longer edit your answer and continue with the next task.</div>
										<div class="submit-solution-button" on:click={submitAnswers}><CheckIcon/>Submit Answer</div>
									</div>
								</div>
								
								{/if}
		
		
								{#if $modalOpenAvatar}
								<div class="modal-task-avatar">
									<div class="modal-task-avatar-content">
										<div class="modal-label-avatar">Select AI Personas</div>
										<div class="modal-description-avatar">AI Personas help you by giving context and and ideas to a certain problem, just like extremely knowledgeable human team  member.</div>
										<div class="avatar-selection-container">
											<AvatarInSelection/>
											<AvatarInSelection/>
											<AvatarInSelection/>
											<AvatarInSelection/>
										</div>
										<div class="button-container">
											<div class="shuffle-button">
												<ShuffleAiAvatars/>
												Shuffle</div>
											<div class="add-ai-avatar-button" on:click={handleAvatarSubmit}>Add AI Persona</div>
										</div>
									</div>
								</div>
								{/if}
								{#if $modalOpenProblem}
								<div class="modal-task-problem">
									<div class="modal-task-problem-content" on:click|stopPropagation>
										<div class="modal-problem-description-label">Add Problem Description</div>
										<div class="modal-subtitle">Add a description of the problem. Try to describe the problem in your own words as detailed as possible. This helps the AI personas to ideate efficiently with you.</div>
										<div class="modal-problem-description-input">
											<textarea bind:value={problemDescription} id='problem-description-input' placeholder="please enter your problem description"></textarea>
										</div>
										<div class="submit-button" on:click={handleSubmit}>submit</div>
									</div>
								</div>
								{/if}
								{#if $modalOpenInfo}
								<div class="modal-task-info">
								<div class="modal-task-info-content">
									<div class="close-button" on:click={handleCloseModalInfo}><MinimizeTaskInfo/></div>
									<div class="ModalLabel">Informations</div><p>The number of people aged 65 years or older worldwide is projected to more than double, rising from 761 million in 2021 to 1.6 billion in 2050. The number of people aged 80 years or older is growing even faster. This growing population brings with it a number of unique health challenges, from chronic diseases such as arthritis and dementia to accidents due to reduced mobility. In conjunction with these health issues, there is also growing demand for products and services that enable seniors to maintain a good quality of life, promote autonomy and stay connected to society. However, the market is still in its early stages and there is still plenty of scope for innovative products that can simplify healthcare for the elderly.</p>
									</div>
								</div>
								{/if}

								{#if $modalOpenTask}
								<div class="modal-task">
									<div class="modal-task-content">
									<div class="close-button" on:click={handleCloseModalTask}><MinimizeTask/></div>
									<div class="ModalLabel">Task</div><p>Your job is to develop a new or improved product or service offering that meets the needs of older people - either to make healthcare more accessible, reduce the risk of accidents, or improve overall quality of life. <br>
										<br><br>1. What are some <b>common problems or challenges faced by the aging population</b> that your product aims to solve? 
										<br><br>2. What is your <b>proposed product or service</b>? Describe its functionality and how it helps the elderly in detail.
										<br><br>3. How does your product or service <b>improve upon or differ from existing solutions in the market</b>?
										<br><br>4. What is the <b>feasibility</b> (practicality or workability of a project, idea, or plan) of implementing your product? Consider factors such as cost, risk, and complexity. </p>
									</div>
								</div>
								{/if}

								{#if $modalOpenSolution}
								<div class="modal-task-solution">
									<div class="modal-task-solution-content">
									  <div class="close-button" on:click={handleCloseModalSolution}><MinimizeTaskSolution/></div>
									  <div class="ModalLabel">Task Solution</div>
								  
									  {#each questions as question, index}
										{#if index === currentQuestion}
										  <div class="SolutionInput-container{index+1}">
											<p>{index+1}. {question}</p>
											<textarea class="SolutionInput" id="solution-input{index+1}" bind:value={answers[index]} on:input={handleInput}></textarea>
										  </div>
										{/if}
									  {/each}
									
									  
									{#if showError}
									<div class="error-no-words">
										<WarningIcon/> Your answer must have at least 50 words
							  		</div>
									{/if}

								  
									  <div class="progress-tracker">
										<div class="progress-tracker-state">{currentQuestion+1}</div> of
										<div class="progress-tracker-end">{questions.length}</div>
									  </div>
								  
									  <div class="solution-submit-container">
										{#if currentQuestion > 0}
										  <div class="solution-back" on:click={prevQuestion}>Back</div>
										{/if}
								  
										{#if currentQuestion < 3}
										  <div class="solution-next" on:click={nextQuestion}>Next</div>
										{:else}
										  <div class="solution-submit" on:click={handleClickSolutionPopup}>Submit Answer</div>
										{/if}
									  </div>
									  
									</div>
								  </div>
								{/if}
		<div class="chat-tabs-container">
			{#each tabs as tab (tab.id)}  
			  <div class={activeTab.id === tab.id ? 'tab-container active' : 'tab-container'} on:click={() => selectTab(tab)}>
				<div class="tab-title">{tab.title}</div>
				<div class="tab-close" on:click|stopPropagation={() => removeTab(tab.id)}><CloseTabIcon /></div>
			  </div>
			{/each}
			<div class="add-tab-container" on:click={addTab}><AddTabIcon /></div>
		  </div>
		<div class="chat-app">
			<div class="avatar-management-container">
				{#if !activeProblem}
				<div class="problem-container-inactive" on:click={handleClickProblem}>
					<div class="add-icon"><AddIcon /></div>
					Describe your problem
				</div>
				{/if}
				{#if activeProblem}
				<div class="problem-container-active" on:click={handleClickProblem}>
					<div class="problem-description-label">Problem Description</div>
					{activeProblem}
				</div>
				{/if}

				{#if activeProblem} <!-- AND avatars selected -->
				<div class="persona-container">
					<Avatar />
				</div>
				{/if}
				
				{#if activeProblem}
				<div class="add-avatar-container" on:click={handleClickAvatar}>
					<AddPersona />
					Add AI Persona
				</div>
				{/if}
			</div>
			<div class="app-chat-container">
				<div class="chat-container" bind:this={chatContainer}>
					<div class="chat-message-container">
						<div class="chat-messages">
							{#each $messages as message (message.id)}
								<div class={`message-bubble ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}>
									{message.text}
								</div>
							{/each}
						</div>
					</div>
					<div class="chat-input">
						{#if !activeProblem}
						<div class="chat-input-text-no-problem-description">
							Add a problem description...
							<div class="add-problem-description-secondary" on:click={handleClickProblem}>
								<AddProblemSecondary/>
								add</div>
						</div>
						{/if}
						{#if activeProblem} <!-- AND wenn kein avatar existiert -->
						<div class="chat-input-text-no-ai-avatar-added" on:click={handleClickAvatar}>
							Add an AI Persona to your ideation session...
							<div class="add-ai-persona-secondary">
								<AddPersonaSecondary/>
								add</div>
						</div>
						{/if}
						{#if activeProblem} <!-- und Avatars wurden hinzugefügt! -->
						<div class="chat-input-text">
							<div class="message-wrapper">
								<textarea class='message-text-area' id='message-text-area' bind:value={messageInput} placeholder="Start your brainstorming session..."></textarea>
							</div>
							<!--<div class="message-text" 
														contenteditable 
														bind:innerHTML={messageInput} 
														on:input={(event) => messageInput = event.target.innerHTML}></div>
							</div>-->
						</div>
						{/if}
						{#if !activeProblem} <!-- OR wenn kein avatar existiert -->
						<div class="chat-input-send-icon-no-problem-description"><SendIconInactive/></div>
						{:else}
						<div class="chat-input-send-icon" on:click={sendMessage}><SendIconActive/></div>
						{/if}
					</div>
					
				</div>
			</div>
			<div class="app-task-container">
				<div class="task-info-container">
					{#if !$isClickedinfo}
					  <div class="task-info-unclicked" on:click={handleClickinfo}><TaskInfoUnclicked/></div>
					{:else}
					  <div class="task-info-clicked" on:click={handleClickinfo}><TaskInfoClicked/></div>
					{/if}
				  </div>
				<div class="task-container">
					{#if !$isClickedtask}
					<div class="task-unclicked" on:click={handleClicktask}><TaskUnclicked/></div>
					{:else}
					<div class="task-clicked" on:click={handleClicktask}><TaskClicked/></div>
					{/if}
				</div>
				<div class="task-solution-container">
					{#if !$isClickedsolution}
					<div class="task-solution-unclicked" on:click={handleClicksolution}><TaskSolutionUnclicked/></div>
					{:else}
					<div class="task-solution-clicked" on:click={handleClicksolution}><TaskSolutionClicked/></div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>

.modal-task-soltuion-popup{
	display: block;
	position: absolute;
	z-index: 1800;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow:hidden;
	background: #12121295;
}

.modal-task-avatar{
	display: block;
	position: absolute;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow:hidden;
	background: #12121280;
}


.modal-task-problem {
	display: block;
	position: absolute;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow:hidden;
	background: #12121280;
}	

.modal-task-info {
	display: block;
	position: absolute;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow:hidden;
	background: #12121280;
}

.modal-task{
	display: block;
	position: fixed;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background: #12121280;

}

.modal-task-solution{
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

.modal-task-info-content {
  display: flex;
  flex-direction: column;
	position: relative;
  background-color: #505050;
  margin: 15% auto;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  color: #D3D3D3;
  word-break: normal;
}

.modal-task-content{
	display: flex;
  flex-direction: column;
	position: relative;
  background-color: #00274A;
  color: #3EA2FF;
  margin: 15% auto;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

.modal-task-solution-content{
		display: flex;
		z-index: 1100;
		flex-direction: column;
		position: relative;
		background-color: #004A3D;
		color: #34E5B0;
		margin: 15% auto;
		padding: 20px;
		border-radius: 10px;
		width: 400px;
		top: -200px;
}

		.solution-submit-container{
			display: flex;
			align-items: center;
		}

				.progress-tracker{
					display: flex;
					gap: 3px;
					margin-left: auto;
					margin-top: 15px;
					margin-right: 12px;
					margin-bottom: 5px;
				}

				.solution-next{
					display: flex;
					width: auto;
					height: 44px;
					box-sizing: border-box;
					padding: 15px;
					background-color:#34E5B0;
					color: #121212;
					align-items: center;
					border-radius: 5px;
					cursor: pointer;
					margin-left: auto;
				} 
				
				.solution-submit{
					display: flex;
					width: auto;
					height: 44px;
					box-sizing: border-box;
					padding: 15px;
					background-color:#34E5B0;
					color: #121212;
					align-items: center;
					border-radius: 5px;
					cursor: pointer;
					margin-left: auto;
				}

.modal-task-avatar-content{
	display: flex;
  	flex-direction: column;
	position: relative;
  	background-color: #444444;
  	color: #9CA4A9;
  	margin: 15% auto;
 	padding: 20px;
  	border-radius: 10px;
  	width: 60em;
	height: auto;

}

		.modal-label-avatar{
			display: flex;
			font-size: 24px;
			font-family: 'Ubuntu Bold';
		}

		.avatar-selection-container{
			display: flex;
			gap:5px;
			margin-top: 15px;
		}

		.button-container{
			display: flex;
			align-items: center;
			margin-top:15px;
		}

		.add-ai-avatar-button{
			display: flex;
			width: auto;
			height: 44px;
			align-items: center;
			background-color: #00372D;
			padding: 15px;
			box-sizing: border-box;
			border-radius: 10px;
			color: #34E5B0;
			cursor: pointer;
		}

		.shuffle-button{
			display: flex;
			width: auto;
			height: 44px;
			padding: 15px;
			align-items: center;
			margin-left: auto;
			box-sizing: border-box;
			margin-right: 15px;
			gap: 3px;
			cursor: pointer;
		}

.modal-task-problem-content{
	display: flex;
  	flex-direction: column;
	position: relative;
  	background-color: #004A3D;
  	color: #34E5B0;
  	margin: 15% auto;
 	padding: 20px;
  	border-radius: 10px;
  	width: 515px;
}

.modal-task-soltuion-popup-content{
	display: flex;
  	flex-direction: column;
	position: relative;
  	background-color: #004A3D;
  	color: #34E5B0;
  	margin: 15% auto;
 	padding: 20px;
  	border-radius: 10px;
  	width: 515px;
}


				.modal-task-soltuion-popup-label{
					display: flex;
					font-size: 24px;
					align-self: center;
					margin-bottom: 5px;
					font-family: 'Ubuntu Bold'
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

.modal-problem-description-label{
	display: flex;
	font-size: 24px;
	font-family: 'Ubuntu Bold';
}

.modal-problem-description-input{
	display: flex;
	width: 100%;
	height: auto;
}

#problem-description-input{
	display: flex;
	width: 100%;
	min-height: 70px;
	max-height: 120px;
	background-color: #033129;
	margin-top: 15px;
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
}

.submit-button{
	display: flex;
	margin-top: 20px;
	margin-left: auto;
	width: 90px;
	height: 40px;
	background-color:#34E5B0;
	color: #121212;
	padding: 10px;
	align-items: center;
	border-radius: 5px;
	box-sizing: border-box;
	justify-content: center;
	cursor: pointer;
}

.SolutionInput-container1{
	display: flex;
	flex-direction: column;
}

					#solution-input1{
						display: flex;
						width: 100%;
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
					}

					#solution-input2{
						display: flex;
						width: 100%;
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
					}

					#solution-input3{
						display: flex;
						width: 100%;
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
					}

					#solution-input4{
						display: flex;
						width: 100%;
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
					}

.modal-task-soltuion-close{
	display: flex;
	margin-left: auto;
	cursor: pointer;
}

.close-button {
  display: flex;
  color: #aaa;
  float: right;
  font-size: 24px;
  font-weight: bold;
  margin-left: auto;
}

.ModalLabel{
	display: flex;
	font-size: 24px;
	font-family: 'Ubuntu Bold';
}

.close-button:hover, .close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}


::-webkit-scrollbar-corner {
  background: none;
}

.message-text {
  min-height: 36px; /* prevent height collapsing when there is no text */
  max-height: 140px;
  width: 100%;
  align-content: center;
  outline: none;
  overflow: scroll;
}

.message-text-area{
	display:flex;
	min-height: 36px; /* prevent height collapsing when there is no text */
	max-height: 250px;
	width: 100%;
	align-content: center;
	outline: none;
}

#message-text-area{
	display:flex;
	min-height: 36px; /* prevent height collapsing when there is no text */
	max-height: 250px;
	width: 100%;
	align-content: center;
	outline: none;
	overflow: scroll;
	background-color: transparent;
	color: #fefefe;
	border: none;
	resize: none;
}

.message-wrapper {
  width: 100%;
  background-color: transparent;
  max-height: 145px;
  color: #fefefe;
  align-items: center;
  margin-top: 20px;
  box-sizing: border-box;
}

	.background-container-app {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.container-app {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
	}

	.chat-app {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.avatar-management-container {
		display: flex;
		width: 15em;
		min-width: 15em;
		height: 100%;
		flex-direction: column;
		gap: 10px;
		margin-left:15px;
	}

	.problem-container-inactive {
		display: flex;
		width: 100%;
		height: 90px;
		background-color: #083a2b70;
		border-radius: 15px;
		justify-content: center;
		align-items: center;
		color: #34e5b0;
		flex-direction: column;
		cursor: pointer;
	}

	.problem-container-active{
		display: flex;
		width: 100%;
		max-width: 450px;
		min-height: 90px;
		background-color: #083a2b70;
		border-radius: 15px;
		justify-content: center;
		align-items: center;
		color: #34e5b0;
		flex-direction: column;
		cursor: pointer;

		padding: 15px;
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box;    /* Firefox, other Gecko */
		box-sizing: border-box;         /* Opera/IE 8+ */
	}

	.problem-description-label{
		display: flex;
		margin-bottom: 5px;
		font-size: 12px;
		color: #1E8465;
	}

	.app-chat-container {
		display: flex;
		width: 100%;
		height: 100%;
		margin-left: 15px;
		flex-direction: column;
	}

	.chat-container{
		display: flex;
		width: 100%;
		height: 75vh;
		background-color: #131313;
		border-bottom-left-radius: 30px;
		border-bottom-right-radius: 30px;
		flex-direction: column;
	}


	.chat-input{
		display: flex;
		background-color: #0A0A0A;
		min-height: 44px;
		height: auto;
		border-radius: 30px;
		align-items: center;
		padding-left: 30px;
		padding-right: 2px;
		padding-top: 4px;
		padding-bottom: 4px;
		box-sizing: border-box;
	}


	.chat-message-container{
		display: flex;
		height: 100%;
		overflow: scroll;
	}

	.chat-messages{
		display: flex;
		width: 100%;
		min-width: 500px;
		height: auto;
		flex-direction: column;
	}


					.message-bubble {
					margin: 10px;
					padding: 10px;
					border-radius: 5px;
					max-width: 60%;
					}

					.message-user {
						align-self: flex-end;
						background-color: #004A3D;
						color: #34E5B0;
					}

					.message-bot {
						align-self: flex-start;
						background-color: #505050;
						color: #D3D3D3;
					}

	.chat-input-text-no-problem-description{
		display: flex;
		width: 100%;
		height: 70px;
		align-items: center;
		gap: 10px;
		color: #9CA4A9;
		cursor: pointer;
	}

	.chat-input-text-no-ai-avatar-added{
		display: flex;
		width: 100%;
		height: 70px;
		align-items: center;
		gap: 10px;
		color: #9CA4A9;
		cursor: pointer;
	}

	.chat-input-text{
		display: flex;
		width: 100%;
		height: auto;
		gap: 10px;
		color: #9CA4A9;
	}

	/* width */
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

	#chat-write{
		border: none;
		width: 100%;
		height: 1em;
		box-sizing: border-box;
		background-color: transparent;
		color: #fefefe;
		outline: none;
		background-color: transparent;
		overflow:auto;
		padding: 15px;
	}

	.chat-input-send-icon-no-problem-description{
		display: flex;
		margin-right: 10px;
	}

	.chat-input-send-icon{
		display: flex;
		cursor: pointer;
		margin-right: 10px;
	}

	.add-problem-description-secondary{
		display: flex;
		gap: 3px;
		align-items: center;
		color: #34E5B0;
	}

	.add-ai-persona-secondary{
		display: flex;
		gap: 3px;
		align-items: center;
		color: #9CA4A9;
	}

	.app-task-container {
		display: flex;
		min-width: 130px;
		height: 100%;
		flex-direction: column;
		align-items: center;
	}

	.task-info-container{
		display: flex;
	}

		.task-info-clicked{
			display: flex;
			cursor: pointer;
		}

		.task-info-unclicked{
			display: flex;
			cursor: pointer;
		}

	.task-container{
		display: flex;
	}

		.task-unclicked{
				display: flex;
				cursor: pointer;
			}

		.task-clicked{
				display: flex;
				cursor: pointer;
			}

	.task-solution-container{
		display: flex;
	}

		.task-solution-unclicked{
					display: flex;
					cursor: pointer;
				}

		.task-solution-clicked{
					display: flex;
					cursor: pointer;
				}

	.persona-container{
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.add-avatar-container {
		display: flex;
		width: 99%;
		height: 90px;
		border: 2px solid #565656;
		border-radius: 15px;
		justify-content: center;
		align-items: center;
		color: #9ca4a9;
		flex-direction: column;
		gap: 10px;
		cursor: pointer;
	}

	.chat-tabs-container {
		display: flex;
		background-color: #1d1d1d;
		width: auto;
		align-items: center;
		margin-left: 17.2em;
	}


  .tab-container {
    display: flex;
    min-width: 20px;
    height: 20px;
    justify-content: center;
    padding-left: 10px;
    color: #9CA4A9;
    cursor: pointer;
  }

  .tab-container.active {
    border-bottom: solid 2px #3ea2ff;
	color: #3ea2ff;
  }

  .add-tab-container {
    display: flex;
    width: auto;
    margin-left: 5px;
    height: 20px;
    justify-content: center;
    cursor: pointer;
  }

  .tab-close {
    display: flex;
    margin-left: 10px;
    cursor: pointer;
  }

  .solution-back{
	display: flex;
	width: auto;
	padding: 15px;
	cursor:pointer;
  }

  .error-no-words{
	display: flex;
	margin-top: 5px;
	color: #FF7878;
	align-items: center;
	gap: 5px;
  }
</style>
