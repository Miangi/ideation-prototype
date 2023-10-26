<script lang="ts">
	import Avatar from './avatar.svelte';

	import AddIcon from '../svg/add_24px.svelte';
	import AddPersona from '../svg/add_persona_24px.svelte';

	import CloseTabIcon from '../svg/close_inactive_tab_18px.svelte';
	import CloseActiveTabIcon from '../svg/close_tab_18px.svelte';
	import AddTabIcon from '../svg/add_tab_18px.svelte';



	import TaskInfoUnclicked from '../svg/taskinfo_notification.svelte';
	import TaskInfoclicked from '../svg/task-info-clicked.svelte';

	import TaskUnclicked from '../svg/task_notofication.svelte';
	import TaskClicked from '../svg/task-clicked.svelte';

	import TaskSolutionUnclicked from '../svg/tasksolution_notification.svelte';
	import TaskSolutionClicked from '../svg/task-solution-clicked.svelte';

	import AddProblemSecondary from '../svg/add_problem_circle_outlined_12px.svelte'
	import AddPersonaSecondary from '../svg/add_ai_circle_outlined_12px.svelte'

	import SendIconInactive from '../svg/send_icon_inactive.svelte'
	import SendIconActive from '../svg/send_icon_active.svelte'


let tabs = [{ id: 1, title: 'Ideation 1'}];
let activeTab = tabs[0];

function addTab() {
  const id = tabs.length + 1;
  const newTab = { id, title: `Ideation ${id}` };
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


import { writable } from 'svelte/store';

let isClickedinfo = writable(false);
let isClickedtask = writable(false);
let isClickedsolution = writable(false);


function handleClickinfo() {
  isClickedinfo.set(true);
}

function handleClicktask() {
	isClickedtask.set(true);
}

function handleClicksolution() {
	isClickedsolution.set(true);
}
	
</script>

<div class="background-container-app">
	<div class="container-app">
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
				<div class="problem-container-inactive">
					<div class="add-icon"><AddIcon /></div>
					Beschreibe dein Problem
				</div>
				<div class="problem-container-active">
					input: Problem descr. vaaaaaaaaaaaaaaariable
				</div>
				<div class="avatar-container">
					<Avatar />
				</div>

				<div class="add-avatar-container">
					<AddPersona />
					KI Persona hinzufügen
				</div>
			</div>
			<div class="app-chat-container">
				<div class="chat-container">
					<div class="chat-messages"></div>
					<div class="chat-input">
						<div class="chat-input-text-no-problem-description">
							Füge eine Problembeschreibung hinzu...
							<div class="add-problem-description-secondary">
								<AddProblemSecondary/>
								hinzufügen</div>
						</div>
						<div class="chat-input-text-no-ai-avatar-added">
							Füge KI Persona für die Session hinzu...
							<div class="add-ai-persona-secondary">
								<AddPersonaSecondary/>
								hinzufügen</div>
						</div>
						<div class="chat-input-text">
							<div class="message-wrapper">
								<div class="message-text" contentEditable></div>
							  </div>
						</div>
						<div class="chat-input-send-icon-no-problem-description"><SendIconInactive/></div>
						<div class="chat-input-send-icon"><SendIconActive/></div>
					</div>
					
				</div>
			</div>
			<div class="app-task-container">
				<div class="task-info-container">
					{#if !$isClickedinfo}
					  <div class="task-info-unclicked" on:click={handleClickinfo}><TaskInfoUnclicked/></div>
					{:else}
					  <div class="task-info-clicked"><TaskInfoclicked/></div>
					{/if}
				  </div>
				<div class="task-container">
					{#if !$isClickedtask}
					<div class="task-unclicked" on:click={handleClicktask}><TaskUnclicked/></div>
					{:else}
					<div class="task-clicked"><TaskClicked/></div>
					{/if}
				</div>
				<div class="task-solution-container">
					{#if !$isClickedsolution}
					<div class="task-solution-unclicked" on:click={handleClicksolution}><TaskSolutionUnclicked/></div>
					{:else}
					<div class="task-solution-clicked"><TaskSolutionClicked/></div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>

::-webkit-scrollbar-corner {
  background: rgba(0,0,0,0);
}

.message-text {
  min-height: 36px; /* prevent height collapsing when there is no text */
  max-height: 140px;
  width: 100%;
  align-content: center;
  outline: none;
  overflow:scroll;
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
		width: 350px;
		min-width: 350px;
		height: auto;
		flex-direction: column;
		gap: 10px;
		margin-left:15px;
	}

	.problem-container-inactive {
		display: none;
		width: 100%;
		height: 120px;
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
		height: 120px;
		background-color: #083a2b70;
		border-radius: 15px;
		justify-content: center;
		align-items: center;
		color: #34e5b0;
		flex-direction: column;
		cursor: pointer;
		word-break: break-all;
		padding: 15px;
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box;    /* Firefox, other Gecko */
		box-sizing: border-box;         /* Opera/IE 8+ */
	}

	.app-chat-container {
		display: flex;
		width: 100%;
		height: 100%;
		min-height: 800px;
		margin-left: 25px;
		flex-direction: column;
	}

	.chat-container{
		display: flex;
		width: 100%;
		height: 80vh;
		background-color: #131313;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;
		flex-direction: column;
	}


	.chat-input{
		display: flex;
		background-color: #0A0A0A;
		height: auto;
		border-radius: 20px;
		align-items: center;
		padding-left: 30px;
		padding-right: 2px;
		padding-top: 4px;
		padding-bottom: 4px;
		box-sizing: border-box;
	}

	.chat-messages{
		display: flex;
		width: 100%;
		min-width: 500px;
		height: 100%;
	}

	.chat-input-text-no-problem-description{
		display: none;
		width: 100%;
		gap: 10px;
		color: #9CA4A9;
		cursor: pointer;
	}

	.chat-input-text-no-ai-avatar-added{
		display: none;
		width: 100%;
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
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: transparent;
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
		display: none;
	}

	.chat-input-send-icon{
		display: flex;
		cursor: pointer;
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
		margin-top: 20px;
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

	.avatar-container{
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.add-avatar-container {
		display: flex;
		width: 99%;
		height: 120px;
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
		margin-left: 390px;
	}

	.chat-tabs-container {
    display: flex;
    background-color: #1d1d1d;
    width: auto;
    align-items: center;
    margin-left: 390px;
  }

  .tab-container {
    display: flex;
    min-width: 100px;
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
</style>
