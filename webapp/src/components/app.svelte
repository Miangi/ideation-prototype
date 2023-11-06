<script>
import App from '../models/App.js'

const app = new App({
	backendUrl: `${BACKEND_SERVER_URL}?token=XTESTXYZ`
})

import Avatar from '../components/chat/visual/avatar.svelte';
import TaskModal from './modals/task_modal.svelte';
import TaskInfoModal from './modals/task_info_modal.svelte'
import TaskSolutionPopup from './modals/task-solution-popup.svelte' 
import TaskSolutionModal from './modals/task-solution.svelte'
import TabManagement from './tab-management/tabs.svelte'
import Interaction from './chat/interaction.svelte'


import { writable } from 'svelte/store';



//implementation functions to handle the info, task and solution modals on the right side

//handle viewing of task background

export let isClickedinfo = writable(false);
export let modalOpenInfo = writable(false);

function handleClickinfo() {
  isClickedinfo.set(true);
  modalOpenInfo.set(true);
};

function handleCloseModalInfo () {
	modalOpenInfo.set(false);
};

//handle viewing of task

let isClickedtask = writable(false);
let modalOpenTask = writable(false);

function handleClicktask() {
	isClickedtask.set(true);
	modalOpenTask.set(true);
};

function handleCloseModalTask () {
	modalOpenTask.set(false);
};

//handle viewing of users task solution

let isClickedsolution = writable(false);
let modalOpenSolution = writable(false);

function handleClicksolution() {
	isClickedsolution.set(true);
	modalOpenSolution.set(true);
};

function handleCloseModalSolution () {
	modalOpenSolution.set(false);
};

		// handle viewing of users task solution popup. This ensures users don't accidentally give incomplete answers


				let isClickedSolutionPopup = writable(false);
				let modalSolutionPopup = writable(false);

				function handleClickSolutionPopup() {
					if (!validAnswer) {
						return;
					}
					
					isClickedSolutionPopup.set(true);
					modalSolutionPopup.set(true);
				};

				function handleCloseSolutionPopup () {
					modalSolutionPopup.set(false);
				};



//implementation of adding a problem description

let problemDescription = ""
let activeProblem = "aas"

const handleSubmit = () => {
	activeProblem = problemDescription;
	modalOpenProblem.set(false);
};

</script>

<div class="background-container-app">
	<div class="container-app">
		{#if $modalSolutionPopup}
			<TaskSolutionPopup on:close={handleCloseSolutionPopup}/>
		{/if}

		{#if $modalOpenInfo}
			<TaskInfoModal on:close={handleCloseModalInfo} on:click={handleClickinfo}/>
		{/if}

		{#if $modalOpenTask}
			<TaskModal on:close={handleCloseModalTask}/>
		{/if}

		{#if $modalOpenSolution}
			<TaskSolutionModal/>
		{/if}

		<TabManagement/>
		<Interaction/>
	</div>
</div>

<style>

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

::-webkit-scrollbar-corner {
	background: none;
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
</style>
