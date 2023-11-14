<script>
    import ConnectionWarning from './connection-warning.svelte';
	import TaskInfoModal from './task/modal-task-info.svelte'
	import TaskInstructionsModal from './task/modal-task-instructions.svelte'
	import TaskSolutionModal from './task/modal-task-solution.svelte'
	import TaskFinishedModal from './task/modal-task-finished.svelte'
	import ChatTabs from './chat/tabs.svelte'
	import ExpertBar from './chat/expert-bar.svelte'
	import ChatWindow from './chat/chat-window.svelte'
	import TaskBar from './task/task-bar.svelte'

	import { goto } from '$app/navigation'
	import { visibleModals } from '../models/state.js'
	import { connect, connectionState } from '../models/app.js'
	import { getCookies } from '../models/cookies.js'

	let cookies = getCookies()

	if(!cookies.token)
		goto('/')
	else
		connect({ url: `${BACKEND_SOCKET_URL}?token=${cookies.token}` })
</script>

<div class="app-container">
	{#if $connectionState === 'lost'}
		<ConnectionWarning/>
	{/if}

	{#if $visibleModals.taskInfo}
		<TaskInfoModal/>
	{/if}

	{#if $visibleModals.taskInstructions}
		<TaskInstructionsModal/>
	{/if}

	{#if $visibleModals.taskSolution}
		<TaskSolutionModal/>
	{/if}

	{#if $visibleModals.taskFinished}
		<TaskFinishedModal/>
	{/if}

	<ChatTabs/>
	<div class="chat-container">
		<ExpertBar/>
		<ChatWindow/>
		<TaskBar/>
	</div>
</div>

<style lang="scss">
	.app-container{
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;

		> .chat-container {
			display: flex;
			width: 100%;
			height: 100%;
		}
	}
</style>
