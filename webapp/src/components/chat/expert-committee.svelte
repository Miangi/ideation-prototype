<script>
	import AIIcon from '../../assets/svg/ai-persona-in-chat.svelte'
    import Spinner from '../spinner.svelte'
	import expertColors from './expert-colors.js'

	export let experts

	$: expertsWithColor = experts.map(
		expert => ({
			...expert,
			color: expertColors[expert.index]
		})
	)

	$: numPlaceholders = 4 - experts.length
</script>

<div class="committee">
	{#if expertsWithColor.length === 4}
		<div class="headline">Your Expert Committee:</div>
	{:else}
		<div class="busy">
			<Spinner/>
			Your Expert Committee is being generated
		</div>
	{/if}
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
		{#each Array(numPlaceholders) as _}
			<div class="placeholder"/>
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
		margin-top: 30px;

		> .headline{
			font-size: 24px;
			font-weight: bold;
			color: #3EA2FF;
		}

		> .busy{
			font-size: 18px;
			font-style: italic;
			color: #34E5B0;
		}
	}

	.experts{
		display: flex;
		justify-content: space-between;
		gap: 10px;
		box-sizing: border-box;
		padding: 15px;
		width: 100%;

		> div{
			display: flex;
			flex-direction: column;
			width: 100%;
			height: auto;
			gap: 20px;
			border: 1px solid #565656;
			border-radius: 15px;
			padding: 20px;
			min-height: 150px;

			.header{
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10px;
			}

			.name{
				font-size: 16px;
				font-weight: bold;
				text-align: center;
			}

			.background{
				display: flex;
				color: #9E9E9E;
			}
		}

		> .placeholder{
			border-color: transparent;
			background-color: #1c1c1c;
			overflow: hidden;
			position: relative;

			&::after {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				transform: translateX(-100%);
				background-image: linear-gradient(
					90deg,
					rgba(#fff, 0) 0,
					rgba(#fff, 0.05) 20%,
					rgba(#fff, 0.15) 60%,
					rgba(#fff, 0)
				);
				animation: shimmer 1s infinite;
				content: '';
			}

			@keyframes shimmer {
				100% {
					transform: translateX(100%);
				}
			}
		}
	}
</style>