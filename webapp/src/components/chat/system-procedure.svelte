<script>
	export let text
</script>

<div class="system-procedure">
	<div class="lds-circle"><div/></div>
	{text}
</div>

<style>
	.system-procedure{
		display: flex;
		align-self: center;
		background-color: #0B2E24;
		margin-top: 15px;
		padding: 20px;
		border-radius: 60px;
		align-items: center;
		font-size: 16px;
		color: #34E5B0;
	}

	.lds-circle {
		display: inline-block;
		transform: translateZ(1px);
		position: relative;
		width: 18px;
		height: 18px;
		margin-right: 15px;
	}

	.lds-circle > div {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #34E5B0;
		animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
	}

	@keyframes lds-circle {
		0%, 100% {
			animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
		}
		0% {
			transform: rotateY(0deg);
		}
		50% {
			transform: rotateY(1800deg);
			animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
		}
		100% {
			transform: rotateY(3600deg);
		}
	}
</style>