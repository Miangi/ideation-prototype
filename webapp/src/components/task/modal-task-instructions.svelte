<script>
	import MinimizeTask from '../../assets/svg/minimize_task_24px.svelte'
	import { visibleModals } from '../../models/state.js'

	let placeholder = writable(false);

</script>

<div class="modal">
	<div class="window">
	<div class="close-button" on:click={() => $visibleModals.taskInstructions = false}><MinimizeTask/></div>
	<div class="title">Task</div>
	{#if placeholder}
	<div class="task1">	<p>You are tasked with either <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">developing an entirely new product or service or improving an existing one to meet elderly's healthcare needs.</span> Whether it makes healthcare more reachable, mitigates the risk of accidents, or enhances their overall life quality further, that's up to your innovation.<br>
		<br><br>1. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Problem Identification:</span> Can you point out the prevalent problems or challenges that the elderly encounter which your product or service is being designed to address? 
		<br><br>2. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Solution Design:</span> Briefly illustrate the product or service you are suggesting. How does it function, and in what ways can it assist the elderly population?
		<br><br>3. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Market Positioning and Feasibility:</span> How does your product or service differentiate itself from existing solutions in the market, and what are the practical considerations for implementing it, including cost, risk, and complexity?</p>
	</div>
	{:else}
	<div class="task2">	<p>Your task is to <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">develop an innovative business model that takes advantage of the opportunity presented by the described shift in the automotive industry towards autonomous vehicles.</span> The business model should not only offer unique value, but also demonstrate how it would generate revenue, satisfy customer needs and give your company a sustainable competitive advantage so other players can not just copy your idea.<br>
		<br><br>1. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Uniqueness:</span> Detail the distinctive attributes of your business model associated specifically with the autonomous driving sector. How is it setting itself apart from the current options in the market? What unaddressed needs or fresh market possibilities does your business model explore? 
		<br><br>2. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Revenue and Customers:</span> Explain the revenue generation streams of your proposed model. What are your primary customer segments and what reasons can you provide to explain why they would find more value in your solution compared to existing ones on the market?
		<br><br>3. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Competitive Advantage and Customer Satisfaction:</span> Describe the factors that would give your business model a lasting competitive advantage within the autonomous vehicle industry. How does your model aim to meet customer needs and expectations around autonomous vehicles? How would you ensure high levels of customer satisfaction and service excellence?</p>
	</div>
	{/if}
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