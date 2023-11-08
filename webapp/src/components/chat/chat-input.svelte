<script>
	import SendIconActive from '../../assets/svg/send_icon_active.svelte'
	import SendIconInactive from '../../assets/svg/send_icon_inactive.svelte'
	import autosize from 'svelte-autosize'

	let inputDom

	function sendMessage(){

	}
</script>


<div class="chat-input">
	<textarea use:autosize bind:value={inputDom} rows="1" placeholder="Describe the problem in your own words"></textarea>
	<div class="send" on:click={sendMessage}>
		<SendIconActive/>
	</div>
</div>


<style lang="scss">
	.chat-input{
		display: flex;
		flex-shrink: 0;
		background-color: #0A0A0A;
		min-height: 58px;
		height: auto;
		border-radius: 30px;
		align-items: center;
		padding: 0 12px;
		box-sizing: border-box;
	}

	textarea{
		display:flex;
		max-height: 250px;
		width: 100%;
		box-sizing: border-box;
		padding: 10px 0 10px 30px;
		overflow-y: auto;
		background-color: transparent;
		color: #fefefe;
		outline: none;
		border: none;
		resize: none;
		font-family: inherit;
		font-size: 16px;
	}

	.send{
		display: flex;
		cursor: pointer;
	}
</style>