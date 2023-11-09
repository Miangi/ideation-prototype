<script>
	import WarningIcon from '../assets/svg/connection-lost.svelte'
	import ReconnectionIcon from '../assets/svg/reconnect.svelte'
	import WaitIcon from '../assets/svg/wait.svelte'
	
	import { onMount, onDestroy } from 'svelte'

	let message = 'connection lost'
	let currentIcon = WarningIcon
	let currentTimeout

	const updateMessage = (newMessage, NewIcon, delay) => {
		if(currentTimeout)
			clearTimeout(currentTimeout)

		currentTimeout = setTimeout(() => {
			message = newMessage
			currentIcon = NewIcon
		}, delay)
	};

	onMount(() => {
		currentTimeout = setTimeout(() => {
			updateMessage('Attempting to reconnect ...', ReconnectionIcon, 0)
			currentTimeout = setTimeout(() => {
				updateMessage('Please wait a moment ...', WaitIcon, 0)
			}, 3000)
		}, 2000)
	})

	onDestroy(() => {
		if (currentTimeout) {
			clearTimeout(currentTimeout)
		}
	})
</script>

<div class="warning-modal">
	<div class="connection-warning-container">
		<div class="connection-warning">
			<svelte:component this={currentIcon} />
			<p>{message}</p>
		</div>
	</div>
</div>

<style>
	.warning-modal{
			display: block;
			position: absolute;
			z-index: 1000;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			background: #12121280;
			border-bottom-left-radius: 30px;
			border-bottom-right-radius: 30px;
			justify-content: center;
			align-items: center;
	}

	.connection-warning-container{
			display: flex;
			position: relative;
			top: 7%;
			left: 45%;
			width: fit-content;
			height: 44px;
			background-color:#300F0F90;
			align-items: center;
			color: #FF7878;
			justify-content: center;
			border-radius: 22px;
			align-self: center;
			padding: 15px;
			box-sizing: border-box;
	}

	.connection-warning{
			display: flex;
			align-items: center;
			gap: 10px;
	}
</style>