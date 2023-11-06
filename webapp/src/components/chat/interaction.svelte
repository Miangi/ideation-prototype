<script>
    import ProblemAndAvatars from './visual/problem-and-avatars.svelte'
    import Chat from './chat-field/chat.svelte'
    import Taskinfo from './taskinfo/app-task.svelte'

</script>

<div class="chat-app">
    <ProblemAndAvatars />
    <Chat />
    <Taskinfo />
</div>

<style>
    
.chat-app {
					display: flex;
					width: 100%;
					height: 100%;
				}


                
</style>