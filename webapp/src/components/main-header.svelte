<script>
	import LogoSmall from '../assets/svg/logo_small.svelte';

	import GroupTag1 from '../assets/svg/group1.svelte';
	import GroupTag2 from '../assets/svg/group2.svelte';
	import GroupTag3 from '../assets/svg/group3.svelte';
	import GroupTag4 from '../assets/svg/group4.svelte';
	import GroupTag5 from '../assets/svg/group5.svelte';

	import { onMount } from 'svelte';
  
	
	let time;

  	onMount(() => {
    	const intervalId = setInterval(() => {
      		time = new Date().toLocaleString();
    	}, 1000);

		return () => {
			clearInterval(intervalId);
		};
  	});
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
					<div class="name">name</div>
					<div class="surname">surname</div>
					<div class="id">#id</div>
				</div>
				<div class="time-and-date">{time}</div>
				<div class="assigned-group">
					<div class="group1"><GroupTag1 /></div>
					<div class="group2"><GroupTag2 /></div>
					<div class="group3"><GroupTag3 /></div>
					<div class="group4"><GroupTag4 /></div>
					<div class="group5"><GroupTag5 /></div>
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

	.group1 {
		display: flex;
	}

	.group2 {
		display: none;
	}

	.group3 {
		display: none;
	}

	.group4 {
		display: none;
	}

	.group5 {
		display: none;
	}
</style>
