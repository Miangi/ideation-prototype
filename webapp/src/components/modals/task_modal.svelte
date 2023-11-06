<script>
	//This modal shows the user the current task that needs to be processed
	
	import MinimizeTask from '../../assets/svg/minimize_task_24px.svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()
</script>

<div class="modal-task">
	<div class="modal-task-content">
	<div class="close-button" on:click={() => dispatch('close-info')}><MinimizeTask/></div>
	<div class="ModalLabel">Task</div>
	<p>Your job is to develop a new or improved product or service offering that meets the needs of older people - either to make healthcare more accessible, reduce the risk of accidents, or improve overall quality of life. <br>
		<br><br>1. What are some <b>common problems or challenges faced by the aging population</b> that your product aims to solve? 
		<br><br>2. What is your <b>proposed product or service</b>? Describe its functionality and how it helps the elderly in detail.
		<br><br>3. How does your product or service <b>improve upon or differ from existing solutions in the market</b>?
		<br><br>4. What is the <b>feasibility</b> (practicality or workability of a project, idea, or plan) of implementing your product? Consider factors such as cost, risk, and complexity. </p>
	</div>
</div>

<style>
	.modal-task{
		display: block;
		position: fixed;
		z-index: 1000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background: #12121280;
	}

			.modal-task-content{
				display: flex;
				flex-direction: column;
				position: relative;
				background-color: #00274A;
				color: #3EA2FF;
				margin: 15% auto;
				padding: 20px;
				border-radius: 10px;
				width: 400px;
			}

			.close-button {
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
</style>