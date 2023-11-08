<script>
	import AIIcon from '../../assets/svg/ai-persona-in-chat.svelte'
	import expertColors from './expert-colors.js'

	export let experts

	$: expertsWithColor = experts.map(
		expert => ({
			...expert,
			color: expertColors[expert.index]
		})
	)
</script>

<div class="committee">
	<div class="headline">Your Expert Committee:</div>
	<div class="experts">
		{#each expertsWithColor as expert}
			<div>
				<div class="header">
					<AIIcon color={expert.color.primary}/>
					<div class="name" style={`color: ${expert.color.primary}`}>
						{expert.name}
					</div>
				</div>
				<div class="background">
					{expert.background}
				</div>
			</div>
		{/each}
	</div>
</div>


<style lang="scss">
	.committee{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		align-items: center;
		margin-top: 15px;

		> .headline{
			font-size: 24px;
			font-weight: bold;
			color: #3EA2FF;
		}
	}

	.experts{
		display: flex;
		justify-content: space-between;
		gap: 10px;
		padding: 15px;

		> div{
			display: flex;
			flex-direction: column;
			width: 100%;
			height: auto;
			gap: 20px;
			border: 1px solid #565656;
			border-radius: 15px;
			padding: 20px;

			.header{
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10px;
			}

			.name{
				font-size: 16px;
				font-weight: bold;
			}

			.background{
				display: flex;
				color: #9E9E9E;
			}
		}
	}
</style>