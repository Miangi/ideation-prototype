<script>
	export let user
	export let text
	export let tentative
</script>

<div class={`user-message ${tentative && 'tentative'}`}>
	<div class="name">{user.firstName} {user.lastName}</div>
	<div class="bubble user-bubble">{text}</div>
</div>

<style lang="scss">
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
			color: #34E5B0;
			background-color: #0B2E24;
		}
	}

	.user-message.tentative{
		.name{
			font-style: italic;
		}

		.bubble{
			font-style: italic;
			color: #2ba782;
			background-color: transparent;
			border: dashed 1px #0B2E24;
		}
	}
</style>