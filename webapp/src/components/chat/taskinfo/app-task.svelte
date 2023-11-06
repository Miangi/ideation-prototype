<script>
import TaskInfoUnclicked from '../../../assets/svg/taskinfo_notification.svelte';
import TaskInfoClicked from '../../../assets/svg/task-info-clicked.svelte';

import TaskUnclicked from '../../../assets/svg/task_notofication.svelte';
import TaskClicked from '../../../assets/svg/task-clicked.svelte';

import TaskSolutionUnclicked from '../../../assets/svg/tasksolution_notification.svelte';
import TaskSolutionClicked from '../../../assets/svg/task-solution-clicked.svelte';

import { writable } from 'svelte/store';


//implementation functions to handle the info, task and solution modals on the right side

//handle viewing of task background

let isClickedinfo = writable(false);
let modalOpenInfo = writable(false);

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



</script>

<div class="app-task-container">
    <div class="task-info-container">
        {#if !$isClickedinfo}
        <div class="task-info-unclicked" on:click={handleClickinfo}>
                <TaskInfoUnclicked/>
        </div>
        {:else}
        <div class="task-info-clicked" on:click={handleClickinfo}>
                <TaskInfoClicked/>
        </div>
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

<style>
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
</style>