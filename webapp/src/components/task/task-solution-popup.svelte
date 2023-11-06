<script>
    //This modal makes sure no incomplete answers are submitted!
    import CheckIcon from '../../assets/svg/check_circle_outline_16px.svelte'
    import { createEventDispatcher } from 'svelte'
    import CloseIcon from '../../assets/svg/close_green_24px.svelte'

    const dispatch = createEventDispatcher()

    // Es fehlt noch die submit-final-answers funktion.
   // function submitAnswers() {
   // if (!validAnswer) {
   //     return;
   // }
    //modalSolutionPopup.set(false);

   // console.log(answers);
        //}

</script>

<div class="modal-task-soltuion-popup">
    <div class="modal-task-soltuion-popup-content" on:click|stopPropagation>
        <div class="modal-task-soltuion-close" on:click={() => dispatch('close')}><CloseIcon/></div>
        <div class="modal-task-soltuion-popup-label">Finished?</div>
        <div class="modal-task-soltuion-popup-subtitle">By clicking submit, your answer will be saved. After that you can no longer edit your answer and continue with the next task.</div>
        <div class="submit-solution-button" on:click={() => dispatch('submit-final-answers')}><CheckIcon/>Submit Answer</div>
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
 
            .modal-task-soltuion-close{
                display: flex;
                margin-left: auto;
                cursor: pointer;
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

</style>