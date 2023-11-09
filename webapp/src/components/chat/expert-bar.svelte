<script>
	import AIAvatar from '../../assets/svg/ai-persona-in-chat.svelte'
	import { currentChat } from '../../models/app.js'
    import expertColors from './expert-colors.js'
</script>

<div class="problem-bar">
	{#if $currentChat?.problemSummary}
		<div class="problem-summary">
			<div class="label">Problem Summary</div>
			{$currentChat.problemSummary}
		</div>
	{:else}
		<div class="problem-summary inactive">
			<div class="label">Problem Summary</div>
			---
		</div>
	{/if}

	{#if $currentChat?.experts?.length > 0}
		<div class="avatars">
			{#each $currentChat.experts as expert}
				<div class="avatar">
					<AIAvatar color={expertColors[expert.index].primary}/>
					{expert.name}
				</div>
			{/each}
		</div>
	{:else}
		<div class="avatars">
			{#each Array(4) as _}
				<div class="avatar placeholder">
					<AIAvatar color="#3f3f3f"/>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.problem-bar{
		display: flex;
		width: 15em;
		min-width: 15em;
		height: 100%;
		flex-direction: column;
		gap: 10px;
		margin-left: 15px;
		margin-right: 15px;

		> .problem-summary{
			display: flex;
			width: 100%;
			max-width: 450px;
			min-height: 90px;
			background-color: #083a2b70;
			border-radius: 15px;
			justify-content: center;
			align-items: center;
			color: #34e5b0;
			flex-direction: column;
			padding: 15px;
			box-sizing: border-box;

			> .label{
				display: flex;
				margin-bottom: 5px;
				font-size: 12px;
				color: #1E8465;
			}

			&.inactive{
				background-color: #2f2f2f;
				color: #696969;

				> .label{
					color: #696969;
				}
			}
		}

		> .avatars{
			display: flex;
			flex-direction: column;
			gap: 10px;

			> .avatar{
				display: flex;
				width: 100%;
				height: 90px;
				border: 2px solid #565656;
				border-radius: 15px;
				justify-content: center;
				align-items: center;
				gap: 5px;
				flex-direction: column;
				color: #B9B9B9;
				background-color: #393939;
				
				&.placeholder{
					color: #b9b9b9;
					background-color: #212121;
					border-color: transparent;
				}
			}
		}
	}
</style>