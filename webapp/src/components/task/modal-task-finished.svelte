<script>
	import CheckCircle from '../../assets/svg/check_circle_outline_34px.svelte'
    import { visibleModals } from '../../models/state'

	let time = 5
	let timer = setInterval(tick, 1000)

	function tick(){
		time--
		if(time === 0)
			close()
	}

	function close(){
		clearInterval(timer)
		$visibleModals.taskFinished = false
	}
</script>

<div class="modal">
	<div class="window">
		<div class="text">🎉 Congratulations</div>
		<div class="label">
			<CheckCircle/>
			Task 1 has been completed! </div>
		<div class="sub-text">You or someone from your team has submitted a solution for this task.</div>
		<button on:click={close}>
			<div class="counter">{time}</div>
			Next Task
		</button>
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
			align-items: center;
			position: relative;
			background-color: #004A3D;
			margin: 15% auto;
			padding: 20px;
			border-radius: 10px;
			width: 550px;
			color: #34E5B0;
			word-break: normal;
			font-size: 16px;
			text-align: center;
			

			> .text{
				margin-top: 5px;
				font-size: 18px;
			}

			> .label{
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32px;
				font-weight: bold;
				gap: 10px;
				margin-top: 15px;
			}

			> .sub-text{
				margin-top: 15px;
			}

			> button{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 200px;
				height: 40px;
				font-size: 18px;
				margin-top: 30px;
				background-color: #4FDB90;
				border: none;
				outline: none;
				border-radius: 5px;
				color: #004A3D;
				gap: 10px;

				> .counter{
					display: flex;
					justify-content: center;
					align-items: center;
					width: 22px;
					height: 22px;
					border-radius: 100px;
					border: solid 2px #004A3D;
				}
			}
		}
	}
</style>