<script>
	import AIAvatar from '../../../assets/svg/ai_persona.svelte';
	import DeletePersona from '../../../assets/svg/delete_persona.svelte';
</script>

<div class="component-avatar">
	<div class="avatar">
		<div class="delete-icon"><DeletePersona /></div>
		<div class="avatar-icon"><AIAvatar /></div>
		<div class="avatar-description">Avatar Occupation</div>
		<div class="avatar-background">insert GPT4 Persona details here and hide</div>
	</div>
</div>

<style>
	.component-avatar {
		display: flex;
		width: 100%;
		height: auto;
	}

	.avatar {
		display: flex;
		width: 100%;
		height: 90px;
		border: 2px solid #565656;
		border-radius: 15px;
		justify-content: center;
		align-items: center;
		color: #b9b9b9;
		flex-direction: column;
		gap: 5px;
		background-color: #393939;
	}

	.delete-icon {
		display: flex;
		position: relative;
		top: -10%;
		left: 43%;
		cursor: pointer;
	}

	.avatar-icon {
		display: flex;
		position: relative;
		top: -10px;
		cursor: pointer;
	}

	.avatar-description {
		display: flex;
		position: relative;
		top: -10px;
		cursor: pointer;
	}

	.avatar-background{
		display: none;
	}
</style>
