<script>
	import AIIcon from '../../assets/svg/ai-persona-in-chat.svelte'
	import Triangle from '../../assets/svg/triangle.svelte'
	import ExpertComitee from './expert-comitee.svelte';
	import GeneratingAnswer from '../../assets/svg/generating-answer-icon.svelte'
    import ChatInput from './chat-input.svelte'


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
			<div class="system-message">
				👉 Start the session by describing the problem in your own words
			</div>
			<div class="expert-comitee-container">
				<ExpertComitee/>
			</div>
			<div class="system-message">
				👉 Feel free to ask questions or come up with ideas
			</div>
	
			<div class="user-message">
				<div class="name">Max Muster</div>
				<div class="bubble user-bubble">What's up?</div>
			</div>
		
			<div class="ai-message">
				<div class="ai-icon"><AIIcon /></div>
				<div class={`bubble ai-persona-1`}>
					<div class="triangle"><Triangle/></div>
					<div class={`persona-name ai-persona-1`}>Master Expert</div>
					Let me interject for a moment, what you guys are referring to as Linux, is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX. Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called "Linux", and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine's resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called "Linux" distributions are really distributions of GNU/Linux. Thank you for taking your time to cooperate with with me, your friendly GNU+Linux neighbor, Richard Stallman.
				</div>
			</div>
			
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
	}

	.bubble{
		display: flex;
		flex-direction: column;
		margin-top: 5px;
		padding: 15px;
		box-sizing: border-box;
		border-radius: 10px;
		background-color:rgb(26, 26, 26);
		color: #9E9E9E;
		align-self: flex-end;
		width: auto;
	}

	.system-message{
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

	.user-message{
		display: flex;
		flex-direction: column;
		text-align: right;
		align-self: flex-end;
		margin-top: 15px;
		max-width: 60%;

		.name{
			color: #34E5B0;
			font-size: 12px;
		}

		.bubble{
			background-color: #0B2E24;
			color: #34E5B0;
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



			.triangle{
				position: relative;
				top:-5px;
				left: -25px;
			}
		
					.ai-persona-1 .bubble {
							background-color: #251010;
						}

						.ai-persona-2 .bubble {
							background-color: #2D1A0B;
						}

						.ai-persona-3 .bubble {
							background-color: #2C263F;
						}

						.ai-persona-4 .bubble {
							background-color: #1A2950;
						}


					.ai-message{
						display: flex;
						width: auto;
						max-width: 60%;
						margin-top: 15px;
						gap: 10px;
						margin-left: 10px;
					}

					.ai-icon{
							margin-top:7px;
						}

					.persona-name{
						display: flex;
						font-size: 16px;
						font-family: 'Ubuntu Bold';
						margin-top: -20px;
					}

					
						.AIPersona1 {
							color: #FF7878;
						}

						.AIPersona2 {
							color: #DBA34F;
						}

						.AIPersona3 {
							color: #CE90E4;
						}

						.AIPersona4 {
							color: #4F76DB;
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