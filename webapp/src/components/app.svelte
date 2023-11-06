<script>
	import TaskInfoModal from './task/modal-task-info.svelte'
	import TaskInstructionsModal from './task/modal-task-instructions.svelte'
	import TaskSolutionModal from './task/modal-task-solution.svelte'
	import ChatTabs from './chat/tabs.svelte'
	import ProblemBar from './chat/problem-bar.svelte'
	import ChatWindow from './chat/chat-window.svelte'
	import TaskBar from './task/task-bar.svelte'

	import { visibleModals } from '../models/ui-state.js'
</script>

<div class="app-container">
	{#if $visibleModals.taskInfo}
		<TaskInfoModal/>
	{/if}

	{#if $visibleModals.taskInstructions}
		<TaskInstructionsModal/>
	{/if}

	{#if $visibleModals.taskSolution}
		<TaskSolutionModal/>
	{/if}

	<ChatTabs/>
	<div class="chat-container">
		<ProblemBar/>
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
