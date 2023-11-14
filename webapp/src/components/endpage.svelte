<script>
	import URlogo from '../assets/svg/URlogo.svelte'
    import WaveFx from './landing/wave-fx.svelte'
	import OpenAILogo from '../assets/svg/openai-plus.svelte'
</script>

<div class="ending-container">
	<div class="logo-UR">
		<URlogo/>
	</div>
	<div class="text">
		<div class="label">🎉 Thank You!</div>
		<div class="subtext">You successfully completed the study!</div>
	</div>
    <div class="thank-you">
		<div class="thank-you-text">You have just contributed to cutting-edge research to find out more about the impact of AI on ideation and creativity. Thank you for all your hard work! If you have any further questions, please do not hesitate to contact the team.</div>
	</div>
    <div class="open-challenge-container">
		<div class="open-challenge">
			<div class="open-logo">
				<OpenAILogo/>
			</div>
			<div class="challenge-text">The winner team of the ChatGPT Plus challenge will be notified via E-Mail you provided</div>
		</div>
	</div>
	<div class="thank-you-text">michael.gindert@stud.uni-regensburg.de</div>
</div>
<div class="wave-fx">
	<WaveFx/>
</div>


<style lang="scss">
.ending-container{
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	z-index: 10;
	position: relative;

    > .text{
        display: flex;
        color: #34E5B0;
		flex-direction: column;
		align-items: center;
		margin-top: 70px;

		>.label{
			font-size: 50px;
			font-family: 'Ubuntu Bold';
		}

		>.subtext{
			font-size: 18.5px;
			margin-top: 10px;
		}
    }

	>.thank-you{
		display: flex;
		justify-content: center;
		margin-top: 120px;
		color: #fefefe;

		>.thank-you-text{
			display: flex;
			width: 750px;
			text-align: center;
		}
	}

	>.open-challenge-container{
		display: flex;
		justify-content: center;
		margin-top: 120px;

		>.open-challenge{
			display: flex;
			align-items: center;
			border: solid #A3A3A3;
			padding: 20px;
			width: 400px;
			gap: 25px;
			border-radius: 15px;

			>.challenge-text{
				display: flex;
				text-align: center;
			}
		}
	}

	>.thank-you-text{
		display: flex;
		justify-content: center;
		margin-top:30px;
		color: #8D8E8E;
	}
}

.logo-UR{
	display: flex;
	width: auto;
	margin-left: auto;
	margin-right: 25px;
	margin-top: 25px;
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