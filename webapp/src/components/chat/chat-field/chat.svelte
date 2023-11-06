<script>
    import SendIconActive from '../../../assets/svg/send_icon_active.svelte'

//implementation Chat

import { onMount, tick } from 'svelte';
import { writable } from 'svelte/store';

let messageInput = ""; 
let messageId = 0;
const messages = writable([]);
	
let chatContainer; 

// Uncomment below code if we have getResponseFromGPT4 function
/*
let botResponse = async(text) => {
	let response = await getResponseFromGPT4(text);
	messages.update(curr => [...curr, { text: response, sender: 'bot', id: messageId }]);
}
*/

let sendMessage = () => {
	messageId++;
	messages.update(curr => [...curr, { text: messageInput, sender: 'user', id: messageId }]);
	// botResponse(messageInput); Uncomment code if we have getResponseFromGPT4 function
	messageInput = "";

	// Scroll to the newest message after sending
	setTimeout(() => {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}, 0);
};

</script>

<div class="app-chat-container">
    <div class="chat-container" bind:this={chatContainer}>
        <div class="chat-message-container">
            <div class="chat-messages">
                {#each $messages as message (message.id)}
                    <div class={`message-bubble ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                        {message.text}
                    </div>
                {/each}
            </div>
        </div>
        <div class="chat-input">
                <div class="chat-input-text">
                    <div class="message-wrapper">
                        <textarea class='message-text-area' id='message-text-area' bind:value={messageInput} placeholder="Start your brainstorming session..."></textarea>
                    </div>
                </div>
                <div class="chat-input-send-icon" on:click={sendMessage}><SendIconActive/></div>
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


                                .message-bubble {
                                    margin: 10px;
                                    padding: 10px;
                                    border-radius: 5px;
                                    max-width: 60%;
                                }

                                        .message-user {
                                            align-self: flex-end;
                                            background-color: #004A3D;
                                            color: #34E5B0;
                                        }

                                        .message-bot {
                                            align-self: flex-start;
                                            background-color: #505050;
                                            color: #D3D3D3;
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