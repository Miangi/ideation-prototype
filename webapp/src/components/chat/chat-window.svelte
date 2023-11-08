<script>
	import SendIconActive from '../../assets/svg/send_icon_active.svelte'
	import SendIconInactive from '../../assets/svg/send_icon_inactive.svelte'
	import AIIcon from '../../assets/svg/ai-persona-in-chat.svelte'
	import Triangle from '../../assets/svg/triangle.svelte'
	import ExpertComitee from './expert-comitee.svelte';
	import GeneratingAnswer from '../../assets/svg/generating-answer-icon.svelte'


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


<div class="app-chat-container">
	<div class="chat-container">
		<div class="chat-message-container">
			<div class="chat-messages">
				<div class="welcome-message">
                    <span style="position: relative; bottom: 2px; margin-right: 3px;">👉</span> Start the session by describing the problem in your own words
                </div>
                <div class="expert-comitee-container">
					<ExpertComitee/>
                </div>
				<div class="start-message">
                    <span style="position: relative; bottom: 2px; margin-right: 3px;">👉</span> Feel free to ask questions or come up with ideas
                </div>
		
				<div class="user-message">
					<div class="username" style="color: #34E5B0;">Max Muster</div>
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
		</div>
		<div class="chat-input">
			<div class="chat-input-text">
				<div class="message-wrapper">
					<textarea class='message-text-area' id='message-text-area' placeholder="Start your brainstorming session..."></textarea>
				</div>
			</div>
			<div class="chat-input-send-icon"><SendIconActive/></div>
		</div>
	</div>
</div>

<style>

.app-chat-container {
	display: flex;
	width: 100%;
	height: 100%;
	margin-left: 15px;
	flex-direction: column;
}

		.chat-container{
			display: flex;
			width: 100%;
			height: 75vh;
			background-color: #131313;
			border-bottom-left-radius: 30px;
			border-bottom-right-radius: 30px;
			flex-direction: column;
		}

				.chat-message-container{
					display: flex;
					height: 100%;
					overflow: scroll;
				}

						.chat-messages{
							display: flex;
							width: 100%;
							min-width: 500px;
							height: auto;
							flex-direction: column;
						}

						.welcome-message, .start-message{
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

						.expert-comitee-container{
							display: flex;
							flex-direction: column;
							width: 100%;
							height: auto;
							align-items: center;
							margin-top: 15px;
						}



								.bubble {
									display: flex;
									flex-direction: column;
									margin-top: 5px;
									padding: 15px;
									border-radius: 10px;
									max-width: 60%;
									background-color:rgb(26, 26, 26);
									color: #9E9E9E;
									align-self: flex-end;
									width: auto;
								}

								.triangle{
									position: relative;
									top:-5px;
									left: -25px;
								}
							
										.user-message {
											display: flex;
											flex-direction: column;
											text-align: right;
											align-self: flex-end;
											margin-top: 15px;
										}

										.user-message .bubble{
											background-color: #0B2E24;
											color: #34E5B0;
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


				.chat-input{
					display: flex;
					background-color: #0A0A0A;
					min-height: 44px;
					height: auto;
					border-radius: 30px;
					align-items: center;
					padding-left: 30px;
					padding-right: 2px;
					padding-top: 4px;
					padding-bottom: 4px;
					box-sizing: border-box;
				}

						.chat-input-text{
							display: flex;
							width: 100%;
							height: auto;
							gap: 10px;
							color: #9CA4A9;
						}

								.message-wrapper {
									width: 100%;
									background-color: transparent;
									max-height: 145px;
									color: #fefefe;
									align-items: center;
									margin-top: 20px;
									box-sizing: border-box;
								}

										.message-text-area{
											display:flex;
											min-height: 36px; /* prevent height collapsing when there is no text */
											max-height: 250px;
											width: 100%;
											align-content: center;
											outline: none;
										}

										#message-text-area{
											display:flex;
											min-height: 36px; /* prevent height collapsing when there is no text */
											max-height: 250px;
											width: 100%;
											align-content: center;
											outline: none;
											overflow: scroll;
											background-color: transparent;
											color: #fefefe;
											border: none;
											resize: none;
										}

						.chat-input-send-icon{
							display: flex;
							cursor: pointer;
							margin-right: 10px;
						}

						::-webkit-scrollbar {
							width: 10px;
						}

/* Track */
::-webkit-scrollbar-track {
	background: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #9ca4a9;
}

::-webkit-scrollbar-corner {
	background: none;
}

</style>