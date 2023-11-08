<script>
	import MinimizeTask from '../../assets/svg/minimize_task_24px.svelte'
	import { visibleModals } from '../../models/state.js'
</script>

<div class="modal">
	<div class="window">
	<div class="close-button" on:click={() => $visibleModals.taskInstructions = false}><MinimizeTask/></div>
	<div class="title">Task</div>
	<p>Your job is to <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">develop a new or improved product or service offering that meets the needs of older people</span> - either to make healthcare more accessible, reduce the risk of accidents, or improve overall quality of life.<br>
		<br><br>1. What are some <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">common problems or challenges faced by the aging population</span> that your product aims to solve? 
		<br><br>2. What is your <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">proposed product or service</span>? Describe its functionality and how it helps the elderly in detail.
		<br><br>3. How does your product or service <span style="font-family: 'Ubuntu Bold'; color: #5AB0FF;">improve upon or differ from existing solutions in the market</span>?
		<br><br>4. What is the <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">feasibility</span> (practicality or workability of a project, idea, or plan) of implementing your product? Consider factors such as cost, risk, and complexity. </p>
	</div>
</div>


<style lang="scss">
	.modal{
		display: block;
		position: absolute;
		z-index: 1000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow:hidden;
		background: #12121280;

		> .window{
			display: flex;
			flex-direction: column;
			position: relative;
			background-color: #00274A;
			color: #3EA2FF;
			margin: 15% auto;
			padding: 20px;
			border-radius: 10px;
			width: 600px;
			font-size: 16px;

			> .title{
                display: flex;
                font-size: 24px;
                font-family: 'Ubuntu Bold';
            }

			> .close-button {
				display: flex;
				color: #aaa;
				float: right;
				font-size: 24px;
				font-weight: bold;
				margin-left: auto;
				cursor: pointer;

				&:active{
					opacity: 0.75;
				}
			}
		}
	}
</style>