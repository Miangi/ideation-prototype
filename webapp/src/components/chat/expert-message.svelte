<script>
	import AIIcon from '../../assets/svg/ai-persona-in-chat.svelte'
	import Triangle from '../../assets/svg/triangle.svelte'
	import expertColors from './expert-colors.js'

	export let expert
	export let text

	$: colors = expertColors[expert.index]
</script>


<div class="expert-message">
	<div class="icon">
		<AIIcon color={colors.primary}/>
	</div>
	<div class="triangle">
		<Triangle color={colors.background}/>
	</div>
	<div class="bubble" style={`color: ${colors.text}; background-color: ${colors.background};`}>
		<div class="name" style={`color: ${colors.primary}`}>{expert.name}</div>
		{text}
	</div>
</div>

<style lang="scss">
	.expert-message{
		display: flex;
		width: auto;
		max-width: 60%;
		margin-top: 15px;
		margin-left: 10px;

		.name{
			display: flex;
			font-size: 16px;
			font-weight: bold;
			margin-top: -4px;
			margin-bottom: 4px;
		}

		> .icon{
			margin-top:7px;
		}

		> .triangle{
			position: relative;
			top: 15px;
			left: 1px;
		}
	}
</style>