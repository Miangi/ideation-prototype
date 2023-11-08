<script>
	import ExpertComitee from './expert-comitee.svelte';
	import GeneratingAnswer from '../../assets/svg/generating-answer-icon.svelte'
    import ChatInput from './chat-input.svelte'
    import SystemMessage from './system-message.svelte';
    import UserMessage from './user-message.svelte';
    import ExpertMessage from './expert-message.svelte';


	const colorSheetPersona1 = {
		primary: '#FF7878',
		text: '#9E9E9E',
		background: '#251010',
	};

	const colorSheetPersona2 = {
		primary: '#DBA34F',
		text: '#9E9E9E',
		background: '#2D1A0B',
	};

	const colorSheetPersona3 = {
		primary: '#CE90E4',
		text: '#9E9E9E',
		background: '#2C263F',
	};

	const colorSheetPersona4 = {
		primary: '#4F76DB',
		text: '#9E9E9E',
		background: '#1A2950',
	};

</script>   


<div class="chat-window">
	<div class="chat-message-container"></div>
		<div class="messages">
			<SystemMessage text="👉 Start the session by describing the problem in your own words"/>

			<div class="expert-comitee-container">
				<ExpertComitee/>
			</div>
			
			<SystemMessage text="👉 Feel free to ask questions or come up with ideas"/>
	
			<UserMessage/>
			<ExpertMessage colors={colorSheetPersona1}/>
			
			<div class="generating-answers-container">
				<GeneratingAnswer/>
				Generating answers
			</div>
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
		min-width: 500px;
		box-sizing: border-box;
		padding: 10px;
		height: auto;
		overflow-y: auto;
		flex-direction: column;

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


	.expert-comitee-container{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		align-items: center;
		margin-top: 15px;
	}

	.generating-answers-container{
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
	}
</style>