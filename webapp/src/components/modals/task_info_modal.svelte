<script>
    //This modal gives the user background informations about the current task
	
	import MinimizeTaskInfo from '../../assets/svg/minimize_task_info24px.svelte';
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()
</script>

<div class="modal-task-background">
    <div class="modal-task-background-content">
        <div class="close-button" on:click={() => dispatch('close')}><MinimizeTaskInfo/></div>
        <div class="ModalLabel">Informations</div>
        <p>The number of people aged 65 years or older worldwide is projected to more than double, rising from 761 million in 2021 to 1.6 billion in 2050. The number of people aged 80 years or older is growing even faster. This growing population brings with it a number of unique health challenges, from chronic diseases such as arthritis and dementia to accidents due to reduced mobility. In conjunction with these health issues, there is also growing demand for products and services that enable seniors to maintain a good quality of life, promote autonomy and stay connected to society. However, the market is still in its early stages and there is still plenty of scope for innovative products that can simplify healthcare for the elderly.</p>
    </div>
</div>

<style>
    .modal-task-background {
	display: block;
	position: absolute;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow:hidden;
	background: #12121280;
}

		.modal-task-background-content {
		display: flex;
		flex-direction: column;
			position: relative;
		background-color: #505050;
		margin: 15% auto;
		padding: 20px;
		border-radius: 10px;
		width: 400px;
		color: #D3D3D3;
		word-break: normal;
		}

			.close-button {
				display: flex;
				color: #aaa;
				float: right;
				font-size: 24px;
				font-weight: bold;
				margin-left: auto;
			}

			.close-button:hover, .close-button:focus {
				color: black;
				text-decoration: none;
				cursor: pointer;
			}

            .ModalLabel{
                display: flex;
                font-size: 24px;
                font-family: 'Ubuntu Bold';
            }

</style>