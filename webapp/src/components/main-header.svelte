<script>
	import LogoSmall from '../assets/svg/logo_small.svelte'

	import { onMount } from 'svelte'
    import { currentTask, userMeta, users } from '../models/app.js'

	let time

	function tick(){
		time = new Date().toLocaleString()
	}

  	onMount(() => {
    	const intervalId = setInterval(tick, 1000)

		tick()

		return () => {
			clearInterval(intervalId)
		}
  	})
</script>

<div class="background-container-header">
	<div class="container-header">
		<div class="header">
			<div class="logo">
				<LogoSmall />
			</div>
			<div class="task-header">
				{#if $currentTask?.number === 1}
					Task 1: Product / Service innovation for elderly
				{:else if $currentTask?.number === 2}
					Task 2: Business Model innovation regarding autonomous driving
				{:else}
					Loading Task ...
				{/if}
			</div>
			<div class="righthand">
				<div class="online">
					{#each $users as user}
						<div class="bubble" title={`${user.firstName} ${user.lastName}`}>
							{user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase()}
						</div>
					{/each}
				</div>
				<div class="participant-info">
					<div class="participant-info-name">
						{#if $userMeta}
							<div class="name">{$userMeta.firstName}</div>
							<div class="surname">{$userMeta.lastName}</div>
							<div class="id">#{$userMeta.id}</div>
						{:else}
							<div class="name">name</div>
							<div class="surname">surname</div>
							<div class="id">#id</div>
						{/if}
					</div>
					<div class="time-and-date">{time}</div>
					<div class="assigned-group">
						{$userMeta?.team?.name}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.background-container-header {
		display: flex;
	}

	.container-header {
		display: flex;
		width: 100%;
		height: auto;
		padding: 15px;
	}

	.header {
		display: flex;
		width: 100%;
		height: auto;
		align-items: center;
	}

	.task-header {
		display: flex;
		margin-left: 25px;
		font-size: large;
		font-family: 'Ubuntu Bold';
		color: #9ca4a9;
	}

	.righthand{
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: auto;
	}

	.online{
		display: flex;
		gap: 5px;

		.bubble{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30px;
			height: 30px;
			border-radius: 100px;
			background-color: #191E49;
			color: #4F87DB;
			font-size: 12px;
			cursor: default;
		}
	}

	.participant-info {
		display: flex;
		flex-direction: column;
		gap: 7px;
		min-height: 65px;
	}

	.participant-info-name {
		display: flex;
		color: #9ca4a9;
		gap: 5px;
	}

	.time-and-date {
		display: flex;
		align-self: flex-end;
	}

	.assigned-group {
		display: flex;
		align-self: center;
		font-size: 11px;
		background-color: #191E49;
		color: #4F87DB;
		border-radius: 100px;
		padding: 6px 10px;
		margin-bottom: -4px;
	}
</style>
