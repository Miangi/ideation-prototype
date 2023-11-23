<script>
	import CloseTabIcon from '../../assets/svg/close_inactive_tab_18px.svelte'
	import CloseActiveTabIcon from '../../assets/svg/close_tab_18px.svelte'
	import AddTabIcon from '../../assets/svg/add_tab_18px.svelte'
	import { chats, createNewChat, selectChat, currentChat } from '../../models/app.js'

	function removeChat(chat){

	}
</script>

<div class="tabs">
	{#each $chats as chat}  
		<div class={chat.id === $currentChat?.id ? 'tab active' : 'tab'} on:click={() => selectChat(chat)}>
			<div class="title">{chat.title}</div>
			{#if $chats.length > 1}
				<div class="close" on:click={() => removeChat(chat)}>
					<CloseTabIcon/>
				</div>
			{/if}
		</div>
	{/each}
	<div class="add" on:click={createNewChat}>
		<AddTabIcon/>
	</div>
</div>

<style lang="scss">
	.tabs{
		display: flex;
		background-color: #1d1d1d;
		width: auto;
		align-items: center;
		margin-left: 17.2em;
		min-height: 23px;
	}

	.tab{
		display: flex;
		min-width: 20px;
		height: 20px;
		justify-content: center;
		padding-left: 10px;
		color: #9CA4A9;
		cursor: pointer;

		&.active{
			border-bottom: solid 2px #3ea2ff;
			color: #3ea2ff;
		}
	}

	.close{
		display: flex;
		margin-left: 10px;
		cursor: pointer;
	}

	.add{
		display: flex;
		width: auto;
		margin-left: 5px;
		height: 20px;
		justify-content: center;
		cursor: pointer;
	}
</style>