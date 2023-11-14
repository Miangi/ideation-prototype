<script>
    import CheckCircle from '../../assets/svg/check_circle_outline_34px.svelte'
    import Countdown from '../../assets/animated/circle-counter.svelte'
</script>

<div class="modal">
    <div class="window">
        <div class="text">🎉 Congratulations</div>
        <div class="label">
            <CheckCircle/>
            Task 1 has been completed! </div>
        <div class="sub-text">Your task solution has been saved successfully</div>
        <div class="button">
            <Countdown/>
            Next Task
        </div>
    </div>
</div>

<style lang="scss">

.modal{
		display: block;
		position: absolute;
		z-index: 1000;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow:hidden;
		background: #12121280;

		> .window{
			display: flex;
			flex-direction: column;
			position: relative;
			background-color: #004A3D;
			margin: 15% auto;
			padding: 20px;
			border-radius: 10px;
			width: 600px;
			color: #34E5B0;
			word-break: normal;
			font-size: 16px;
            

			> .text{
                display: flex;
                margin-top: 5px;
                font-size: 18px;
            }

            > .label{
                display: flex;
                font-size: 24px;
                font-family: 'Ubuntu Bold';
                gap: 10px;
                margin-top: 15px;
            }

            > .sub-text{
                display: flex;
                margin-top: 15px;
            }

            > .button{
                display: flex;
                font-size: 18px;
            }
		}
	}

</style>