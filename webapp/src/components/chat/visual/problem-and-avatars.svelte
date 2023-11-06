<script>
    import Avatar from './avatar.svelte'
    import { writable } from 'svelte/store';

    let activeProblem = 'a'

</script>

<div class="problem-persona-container">
    {#if activeProblem}
        <div class="problem-container-active">
            <div class="problem-description-label">Problem Description</div>
            {activeProblem}
        </div>
    {/if}

    {#if activeProblem} <!-- AND avatars selected -->
        <div class="persona-container">
            <Avatar />
        </div>
    {/if}
</div>

<style>

.problem-persona-container {
    display: flex;
    width: 15em;
    min-width: 15em;
    height: 100%;
    flex-direction: column;
    gap: 10px;
    margin-left:15px;
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
    
        .persona-container{
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
</style>