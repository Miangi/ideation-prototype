<script>
	import MinimizeTaskInfo from '../../assets/svg/minimize_task_info24px.svelte'
    import { currentTask } from '../../models/app';
	import { visibleModals } from '../../models/state.js'

</script>

<div class="modal">
    <div class="window">
        <div class="close-button" on:click={() => $visibleModals.taskInfo = false}><MinimizeTaskInfo/></div>
        <div class="title">Information</div>
		{#if $currentTask?.number === 1}
			<div class="info1"><p>There's been a significant increase in the global aging population. The world will see the numbers from people aged 60 or older grow from 761 million today to 1.6 billion in 2050. Likewise, the population aged 80 years and older will also grow exponentially. With it, there are serious health issues, such as chronic illnesses and mobility-related accidents, that need to be addressed. At the same time, there is a rising demand for innovative products and services to help seniors maintain quality of life, be more independent, and have a societal connection. The market for healthcare solutions targeting seniors is in its infancy, with ample room for growth and innovative breakthroughs. Your task is to tap into this potential.
				<br>
				<br>
				Now keep in mind that the older community faces a myriad of healthcare obstacles, including chronic diseases, mobility hurdles, and cognitive degeneration. The better the solutions we can create to address these, the more we can enhance seniors' living standards. With technological advancements in wearable devices, telehealth services, and remote monitoring systems, healthcare for the elderly can be transformed and improved. These innovative possibilities push the boundaries of more accessible care, early health issue detection, and better monitoring.</p>
			</div>
		{:else if $currentTask?.number === 2}
			<div class="info2"><p>The transportation sector is on the brink of a major revolution with the introduction of autonomous vehicles. This shift goes beyond traditional car manufacturers and includes technology companies, startups, and service providers, all of whom have the potential to transform the industry with new business models centered around autonomous driving technologies.
				Cloud-based computational technologies are playing an increasingly significant role in this transformation, providing immense storage capacities and powerful processing capabilities to support autonomous systems. When combined with artificial intelligence, these technologies enable vehicles to learn, make real-time decisions, and adapt to their surroundings.
				<br>
				<br>
				The shift to autonomous driving creates opportunities for innovative business models, such as Mobility as a Service (MaaS) and shared ownership. Eliminating the need for parking opens up space for revenue generation. In-car entertainment and productivity services can enhance the travel experience. Autonomous delivery services and insurance models may also evolve. Infrastructure upgrades will be necessary for communication and data-sharing systems.</p>
			</div>
		{:else}
			Loading task info ...
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
			margin: 5% auto;
			padding: 20px;
			border-radius: 10px;
			width: 600px;
			color: #CCCCCC;
			word-break: normal;
			font-size: 16px;

			> .title{
                display: flex;
                font-size: 24px;
                font-family: 'Ubuntu Bold';
            }

			> .close-button {
				display: flex;
				color: #CCCCCC;
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