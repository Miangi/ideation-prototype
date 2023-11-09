<script>
	import URlogo from '../../assets/svg/URlogo.svelte'
    import WaveFx from './wave-fx.svelte';

	import InputForm from './inputs.svelte'

</script>

<div class="landing-container">
	<div class="logo-UR">
		<URlogo/>
	</div>
	<div class="welcome-message">
		<div class="label">Welcome to the study</div>
		<div class="subtext">You will be brainstorming with AI</div>
	</div>
	<InputForm/>
</div>
<div class="wave-fx">
	<WaveFx/>
</div>


<style lang="scss">
.landing-container{
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	z-index: 10;
	position: relative;
}

.logo-UR{
	display: flex;
	width: auto;
	margin-left: auto;
	margin-right: 25px;
	margin-top: 25px;
}

.welcome-message{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 10%;
	gap: 5px;
	color: #34E5B0;

	.label{
		font-size: 36px;
		font-weight: bold;
	}
}

.wave-fx{
	position: absolute;
	left: 0;
	right: 0;
	bottom: calc(20vh - 250px);
	height: 400px;
	overflow: hidden;
	z-index: 1;
}

</style>