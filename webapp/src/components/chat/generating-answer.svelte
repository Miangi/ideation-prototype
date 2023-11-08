<script>
	import expertColors from './expert-colors.js'

	export let expert

	$: color = expertColors[expert.index].primary
</script>

<div class="container">
	<div class="dots">
		<span style={`background-color: ${color}`}/>
		<span style={`background-color: ${color}`}/>
		<span style={`background-color: ${color}`}/>
	</div>
	Generating answer
</div>

<style lang="scss">
	.container{
		display: flex;
		margin-left: 50px;
		width: 200px;
		height: 44px;
		gap: 10px;
		box-sizing: border-box;
		border-radius: 22px;
		background-color: #03030370;
		align-items: center;
		justify-content: center;
		margin-top: 10px;
		flex-shrink: 0;
	}

	.dots{
		display: flex;
		gap: 2px;

		> span{
			display: block;
			width: 5px;
			height: 5px;
			border-radius: 5px;
			animation: dot-flashing 1s infinite linear alternate;

			&:nth-child(2){
				animation-delay: 0.5s;
			}

			&:nth-child(3){
				animation-delay: 1s;
			}
		}
	}

	@keyframes dot-flashing {
		0% {
			opacity: 1;
		}
		50%, 100% {
			opacity: 0.2;
		}
	}
</style>