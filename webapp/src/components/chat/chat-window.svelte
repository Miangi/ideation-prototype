<script>
	import ExpertCommittee from './expert-committee.svelte'
    import ChatInput from './chat-input.svelte'
    import SystemMessage from './system-message.svelte'
    import UserMessage from './user-message.svelte'
    import ExpertMessage from './expert-message.svelte'
    import GeneratingAnswer from './generating-answer.svelte'
	
    import { onMount } from 'svelte'
	import { currentChat, users } from '../../models/app.js'

	let messagesContainerDom
	let detached = false

	async function scrollToBottom(instant){
		if(detached)
			return

		await Promise.resolve()

		messagesContainerDom.scrollTo({
			top: 999999,
			behavior: instant ? 'instant' : 'smooth'
		})
	}

	function handleScroll(e){
		let maxScrollTop = messagesContainerDom.scrollHeight - messagesContainerDom.clientHeight
		let distanceFromBottom = maxScrollTop - messagesContainerDom.scrollTop
		
		if(distanceFromBottom > 5){
			detached = true
		}else{
			detached = false
		}
	}

	onMount(() => {
		let unsubscribe = currentChat.subscribe(scrollToBottom)
		messagesContainerDom.addEventListener('scroll', handleScroll)

		scrollToBottom(true)

		return () => {
			unsubscribe()
			messagesContainerDom.removeEventListener('scroll', handleScroll)
		}
	})
</script>   


<div class="chat-window">
	<div class="chat-message-container"></div>
		<div class="messages" bind:this={messagesContainerDom}>
			{#if $currentChat}
				{#each $currentChat.messages as message}
					{#if message.user}
						<UserMessage
							user={$users.find(user => user.id == message.user.id)}
							text={message.text}
						/>
					{:else if message.expert}
						<ExpertMessage/>
					{:else}
						{#if message.text === '(experts)'}
							<ExpertCommittee experts={$currentChat.experts}/>
						{:else}
							<SystemMessage text={message.text}/>
						{/if}
					{/if}
				{/each}

				{#each Object.entries($currentChat.typingUsers) as [id, text]}
					{#if text}
						<UserMessage
							user={$users.find(user => user.id == parseInt(id))}
							text={text}
							tentative={true}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	<ChatInput/>
</div>

<style lang="scss">
	.chat-window{
		display: flex;
		width: 100%;
		height: 75vh;
		background-color: #131313;
		border-bottom-left-radius: 30px;
		border-bottom-right-radius: 30px;
		flex-direction: column;
	}

	.messages{
		display: flex;
		width: 100%;
		height: 100%;
		min-width: 500px;
		box-sizing: border-box;
		padding: 10px;
		overflow-y: auto;
		flex-direction: column;
		padding-bottom: 50px;

		&::-webkit-scrollbar {
			width: 10px;
		}

		&::-webkit-scrollbar-track {
			background: none;
		}

		&::-webkit-scrollbar-thumb {
			background: #888;
			border-radius: 10px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #9ca4a9;
		}

		&::-webkit-scrollbar-corner {
			background: none;
		}

		:global(.bubble){
			display: flex;
			flex-direction: column;
			margin-top: 5px;
			padding: 15px;
			box-sizing: border-box;
			border-radius: 10px;
			align-self: flex-end;
			width: auto;
		}
	}
</style>