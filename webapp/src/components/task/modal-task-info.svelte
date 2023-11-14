<script>
	import MinimizeTaskInfo from '../../assets/svg/minimize_task_info24px.svelte'
	import { visibleModals } from '../../models/state.js'


	let placeholder = writable(false);
</script>

<div class="modal">
    <div class="window">
        <div class="close-button" on:click={() => $visibleModals.taskInfo = false}><MinimizeTaskInfo/></div>
        <div class="title">Information</div>
		{#if placeholder}
		<div class="info1"><p>There's been a significant increase in the global aging population. The world will see the numbers grow from 761 million today to 1.6 billion in 2050. Likewise, the population aged 80 years and older will also grow exponentially. With it, there are serious health issues, such as chronic illnesses and mobility-related accidents, that need to be addressed. At the same time, there is a rising demand for innovative products and services to help seniors maintain quality of life, be more independent, and have a societal connection. The market for healthcare solutions targeting seniors is in its infancy, with ample room for growth and innovative breakthroughs. Your task is to tap into this potential.
			<br>
			<br>
			Now keep in mind that the older community faces a myriad of healthcare obstacles, including chronic diseases, mobility hurdles, and cognitive degeneration. The better the solutions we can create to address these, the more we can enhance seniors' living standards. With technological advancements in wearable devices, telehealth services, and remote monitoring systems, healthcare for the elderly can be transformed and improved. These innovative possibilities push the boundaries of more accessible care, early health issue detection, and better monitoring.</p>
		</div>
		{:else}
		<div class="info2"><p>The transportation sector is on the brink of a major revolution with the introduction of autonomous vehicles. This shift goes beyond traditional car manufacturers and includes technology companies, startups, and service providers, all of whom have the potential to transform the industry with new business models centered around autonomous driving technologies.
			Cloud-based computational technologies are playing an increasingly significant role in this transformation, providing immense storage capacities and powerful processing capabilities to support autonomous systems. When combined with artificial intelligence, these technologies enable vehicles to learn, make real-time decisions, and adapt to their surroundings.
			Changing trends indicate a shift from the traditional model of owning a car to a more flexible "use-as-needed" approach, which is shaping the business models in this domain.
			To adapt to these evolving trends, businesses need to address new customer needs and preferences. While safety and comfort remain important, factors such as on-board entertainment and maximizing travel time productivity are gaining prominence, driving innovation in the industry.</p>
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
			background-color: #505050;
			margin: 15% auto;
			padding: 20px;
			border-radius: 10px;
			width: 600px;
			color: #D3D3D3;
			word-break: normal;
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