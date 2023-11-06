<script>
	import AIAvatar from '../../assets/svg/ai_persona.svelte'

	let activeProblem = undefined
</script>

<div class="problem-bar">
	{#if activeProblem}
		<div class="problem-summary">
			<div class="label">Problem Summary</div>
			{activeProblem}
		</div>
	{:else}
		<div class="problem-summary inactive">
			<div class="label">Problem Summary</div>
			---
		</div>
		<div class="avatars">
			{#each Array(5) as _, i}
				<div class="avatar placeholder">
					<div class="icon">
						<AIAvatar/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.problem-bar{
		display: flex;
		width: 15em;
		min-width: 15em;
		height: 100%;
		flex-direction: column;
		gap: 10px;
		margin-left:15px;

		> .problem-summary{
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
			padding: 15px;
			box-sizing: border-box;

			> .label{
				display: flex;
				margin-bottom: 5px;
				font-size: 12px;
				color: #1E8465;
			}

			&.inactive{
				background-color: #2f2f2f;
				color: #696969;

				> .label{
					color: #696969;
				}
			}
		}

		> .avatars{
			display: flex;
			flex-direction: column;
			gap: 10px;

			> .placeholder{
				display: flex;
				width: 100%;
				height: 90px;
				border: 2px solid transparent;
				border-radius: 15px;
				justify-content: center;
				align-items: center;
				color: #b9b9b9;
				flex-direction: column;
				gap: 5px;
				background-color: #212121;

				.icon{
					opacity: 0.15;
				}
			}
		}
	}
</style>