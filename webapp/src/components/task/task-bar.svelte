<script>
import TaskInfoUnclicked from '../../assets/svg/taskinfo_notification.svelte';
import TaskInfoClicked from '../../assets/svg/task-info-clicked.svelte';

import TaskUnclicked from '../../assets/svg/task_notofication.svelte';
import TaskClicked from '../../assets/svg/task-clicked.svelte';

import TaskSolutionUnclicked from '../../assets/svg/tasksolution_notification.svelte';
import TaskSolutionClicked from '../../assets/svg/task-solution-clicked.svelte';

import { visibleModals, unseenContent } from '../../models/ui-state.js'

function onTaskInfoClicked(){
	$visibleModals.taskInfo = true
	$unseenContent.taskInfo = false
}

function onTaskInstructionsClicked(){
	$visibleModals.taskInstructions = true
	$unseenContent.taskInstructions = false
}

function onTaskSolutionClicked(){
	$visibleModals.taskSolution = true
	$unseenContent.taskSolution = false
}

</script>

<div class="task-bar">
	<div class="button" on:click={onTaskInfoClicked}>
		{#if $unseenContent.taskInfo}
			<TaskInfoUnclicked/>
		{:else}
			<TaskInfoClicked/>
		{/if}
	</div>

	<div class="button" on:click={onTaskInstructionsClicked}>
		{#if $unseenContent.taskInstructions}
			<TaskUnclicked/>
		{:else}
			<TaskClicked/>
		{/if}
	</div>

	<div class="button" on:click={onTaskSolutionClicked}>
		{#if $unseenContent.taskSolution}
			<TaskSolutionUnclicked/>
		{:else}
			<TaskSolutionClicked/>
		{/if}
	</div>
</div>

<style lang="scss">
	.task-bar{
		display: flex;
		min-width: 130px;
		height: 100%;
		flex-direction: column;
		align-items: center;

		> .button{
			display: flex;
			cursor: pointer;

			&:active{
				opacity: 0.75;
			}
		}
	}
</style>