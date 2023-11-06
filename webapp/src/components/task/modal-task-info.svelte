<script>
	import MinimizeTaskInfo from '../../assets/svg/minimize_task_info24px.svelte'
	import { visibleModals } from '../../models/ui-state.js'

</script>

<div class="modal">
    <div class="window">
        <div class="close-button" on:click={() => $visibleModals.taskInfo = false}><MinimizeTaskInfo/></div>
        <div class="title">Informations</div>
        <p>The number of people aged 65 years or older worldwide is projected to more than double, rising from 761 million in 2021 to 1.6 billion in 2050. The number of people aged 80 years or older is growing even faster. This growing population brings with it a number of unique health challenges, from chronic diseases such as arthritis and dementia to accidents due to reduced mobility. In conjunction with these health issues, there is also growing demand for products and services that enable seniors to maintain a good quality of life, promote autonomy and stay connected to society. However, the market is still in its early stages and there is still plenty of scope for innovative products that can simplify healthcare for the elderly.</p>
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
			background-color: #505050;
			margin: 15% auto;
			padding: 20px;
			border-radius: 10px;
			width: 400px;
			color: #D3D3D3;
			word-break: normal;

			> .title{
                display: flex;
                font-size: 24px;
                font-family: 'Ubuntu Bold';
            }

			> .close-button {
				display: flex;
				color: #aaa;
				float: right;
				font-size: 24px;
				font-weight: bold;
				margin-left: auto;
				cursor: pointer;

				&:active{
					opacity: 0.75;
				}
			}
		}
	}
</style>