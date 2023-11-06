<script>
import TaskInfoUnclicked from '../../../assets/svg/taskinfo_notification.svelte';
import TaskInfoClicked from '../../../assets/svg/task-info-clicked.svelte';

import TaskUnclicked from '../../../assets/svg/task_notofication.svelte';
import TaskClicked from '../../../assets/svg/task-clicked.svelte';

import TaskSolutionUnclicked from '../../../assets/svg/tasksolution_notification.svelte';
import TaskSolutionClicked from '../../../assets/svg/task-solution-clicked.svelte';

import { writable } from 'svelte/store';

let isClickedinfo = writable(false);
let isClickedtask = writable(false);
let isClickedsolution = writable(false);

function taskInfoClicked() {
  isClickedinfo.set(true);
};

</script>

<div class="app-task-container">
    <div class="task-info-container">
        {#if !$isClickedinfo}
        <div class="task-info-unclicked" on:click={() => dispatch('open-info')} on:click={taskInfoClicked}>
                <TaskInfoUnclicked/>
        </div>
        {:else}
        <div class="task-info-clicked" on:click={() => dispatch('open-info')}>
                <TaskInfoClicked/>
        </div>
        {/if}
    </div>
    <div class="task-container">
        {#if !$isClickedtask}
        <div class="task-unclicked"><TaskUnclicked/></div>
        {:else}
        <div class="task-clicked"><TaskClicked/></div>
        {/if}
    </div>
    <div class="task-solution-container">
        {#if !$isClickedsolution}
        <div class="task-solution-unclicked"><TaskSolutionUnclicked/></div>
        {:else}
        <div class="task-solution-clicked"><TaskSolutionClicked/></div>
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