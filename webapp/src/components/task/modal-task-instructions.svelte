<script>
	import MinimizeTask from '../../assets/svg/minimize_task_24px.svelte'
	import { visibleModals } from '../../models/state.js'
	import { currentTask } from '../../models/app.js'
</script>

<div class="modal">
	<div class="window">
	<div class="close-button" on:click={() => $visibleModals.taskInstructions = false}><MinimizeTask/></div>
	<div class="title">Task</div>
		{#if $currentTask?.number === 1}
			<div class="task1">	<p>You are tasked with either <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">developing an entirely new product or service or improving an existing one to meet elderly's healthcare needs.</span> Whether it makes healthcare more reachable, mitigates the risk of accidents, or enhances their overall life quality further, that's up to your innovation.<br>
				<br><br>1. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Identify the Problem or Need</span><br> What specific healthcare problem or need does the elderly population currently face? Your goal in this subtask is to identify the gaps in the current healthcare system targeting this demography. What are major areas of concern that have not been adequately addressed? Define them clearly and concisely.
				<br><br>2. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Define Your Solution Design</span><br>Based on the identified problem or need, what's your solution? Whether it's a novel product or service innovation or a significant improvement of an existing one, what will it look like? Describe your proposed solution, how it works, and why it will be useful. 
				<br><br>3. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Market Analysis and Target Audience</span><br> Who are your potential customers? You need to identify your target market. What is the size of this market, and who are the key competitors? Describe your target audience's demographics, needs, and problems, including any unique aspects.
				<br><br>4. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Unique Value Proposition and Competitive Advantage </span><br>  What is your product/service's unique advantage over the competition? What makes your solution uniquely suited to the problem or need you've identified for this specific demographic? Explain how your solution creates value sustainably and how you will keep this edge over the future competitors that can emerge within the market.
			</p>
			</div>
		{:else if $currentTask?.number === 2}
			<div class="task2">	<p>Your task is to <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">develop an innovative business model that takes advantage of the opportunity presented by the described shift in the automotive industry towards autonomous vehicles.</span> The business model should not only offer unique value, but also demonstrate how it would generate revenue, satisfy customer needs and give your company a sustainable competitive advantage so other players can not just copy your idea.<br>
				<br><br>1. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Value Proposition (Core Offering and Unique Differentiator)</span><br> What is the unique value proposition of your new business model that capitalizes on the shift towards autonomous vehicles? What would your business offer that is different from what's already in the market? Consider the customer's perspective—what problem does your offering solve or what customer needs does it fulfill?
				<br><br>2. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Customer Segments and Relationships (Target Audience and Engagement)</span><br> Who are your target customers for this new business model? How do you plan to attract, retain, and deepen the relationship with these customers? How does your business model cater specifically to these customer segments?
				<br><br>3. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Key Resources, Activities, and Partnerships (Execution Plan)</span><br> What key resources and activities are required to deliver your value proposition? What partners will you need to collaborate with to execute your business model effectively?
				<br><br>4. <span style="font-family: 'Ubuntu Bold';color: #5AB0FF;">Revenue Streams and possible costs (Monetization Strategy)</span><br> How will your business model generate revenue? What is your pricing strategy? Will it have a one-time transaction, subscription model, or a mix? Consider the value customers will receive and how much they will be willing to pay for it. Outline the most important costs that need to be taken into account in the business model. 
			</p>
			</div>
		{:else}
			Loading task instructions ...
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
			margin: 5% auto;
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