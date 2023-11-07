<script>
import MinimizeTaskSolution from '../../assets/svg/minimize_task_solution24px.svelte'
import WarningIcon from '../../assets/svg/warning_amber_18px.svelte'
import { visibleModals } from '../../models/ui-state.js'

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

// Function to submit the answers --> wird jetzt von Solution Popup ausgeführt
//function submitAnswers() {
//    if (!validAnswer) {
//        return;
//    }
 //   modalSolutionPopup.set(false);
//
//    console.log(answers);
//}

</script>

<div class="modal-task-solution">
    <div class="modal-task-solution-content">
        <div class="close-button" on:click={() => $visibleModals.taskSolution = false}><MinimizeTaskSolution/></div>
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
                <div class="solution-submit" on:click={() => dispatch('open-solution-popup')}>Submit Answer</div>
            {/if}
        </div>
    </div>
</div>

<style>
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
                width: 600px;
                top: -200px;
                font-size: 16px;
            }

            .close-button { /* this only styles position i think*/
                display: flex;
                color: #aaa;
                float: right;
                font-size: 24px;
                font-weight: bold;
                margin-left: auto;
                cursor: pointer;
            }

            .ModalLabel{
                display: flex;
                font-size: 24px;
                font-family: 'Ubuntu Bold';
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


                                    .error-no-words{
                                        display: flex;
                                        margin-top: 5px;
                                        color: #FF7878;
                                        align-items: center;
                                        gap: 5px;
                                    }

                                    .progress-tracker{
                                        display: flex;
                                        gap: 3px;
                                        margin-left: auto;
                                        margin-top: 15px;
                                        margin-right: 12px;
                                        margin-bottom: 5px;
                                    }
                                    
                                    .solution-submit-container{
                                        display: flex;
                                        align-items: center;
                                    }


                                    .solution-back{
                                        display: flex;
                                        width: auto;
                                        padding: 15px;
                                        cursor:pointer;
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