<script>
    import { onMount } from 'svelte';
	import SendIconActive from '../../assets/svg/send_icon_active.svelte'
	import SendIconInactive from '../../assets/svg/send_icon_inactive.svelte'
	import autosize from 'svelte-autosize'
    import { currentChat, setChatInput, submitChatInput } from '../../models/app.js'

	let inputDom

	function sendMessage(){
		if($currentChat.locked)
			return

		submitChatInput(inputDom.value)
		inputDom.value = ''
		autosize.update(inputDom)
	}

	onMount(() => {
		inputDom.addEventListener('input', () => {
			setChatInput(inputDom.value)
		})

		inputDom.addEventListener('keydown', e => {
			if(e.keyCode === 13){
				sendMessage()
				e.preventDefault()
			}
		})
	})
</script>


<div class="chat-input">
	<textarea use:autosize bind:this={inputDom} rows="1" placeholder="Describe the problem in your own words"></textarea>
	{#if $currentChat && !$currentChat?.locked}
		<div class="send" on:click={sendMessage}>
			<SendIconActive/>
		</div>
	{:else}
		<div class="send disabled">
			<SendIconInactive/>
		</div>
	{/if}
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
		
		&:not(.disabled){
			cursor: pointer;
		}
	}
</style>