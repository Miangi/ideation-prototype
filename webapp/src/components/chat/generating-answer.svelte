<script>
	import expertColors from './expert-colors.js'

	export let colorIndex
	export let text

	$: color = typeof colorIndex === 'number' ? expertColors[colorIndex].primary : '#34E5B0'
</script>

<div class="container">
	<div class="dots">
		<span style={`background-color: ${color}`}/>
		<span style={`background-color: ${color}`}/>
		<span style={`background-color: ${color}`}/>
	</div>
	{text}
</div>

<style lang="scss">
	.container{
		display: inline-flex;
		margin-left: 50px;
		padding: 0 12px;
		width: min-content;
		height: 38px;
		gap: 10px;
		box-sizing: border-box;
		border-radius: 10px;
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