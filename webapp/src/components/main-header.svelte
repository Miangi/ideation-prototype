<script>
	import LogoSmall from '../assets/svg/logo_small.svelte'

	import GroupTag1 from '../assets/svg/group1.svelte'
	import GroupTag2 from '../assets/svg/group2.svelte'
	import GroupTag3 from '../assets/svg/group3.svelte'
	import GroupTag4 from '../assets/svg/group4.svelte'
	import GroupTag5 from '../assets/svg/group5.svelte'

	import { onMount } from 'svelte'
    import { userMeta } from '../models/app.js'
  
	const groupTagMap = {
		'Gruppe 1': GroupTag1,
		'Gruppe 2': GroupTag2,
		'Gruppe 3': GroupTag3,
		'Gruppe 4': GroupTag4,
		'Gruppe 5': GroupTag5,
	}
	
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
			<div class="task-header">Task 1: Product / Service innovation for elderly</div>
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
					<svelte:component this={groupTagMap[$userMeta?.group?.name]}/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
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

	.participant-info {
		display: flex;
		flex-direction: column;
		margin-left: auto;
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
	}
</style>
