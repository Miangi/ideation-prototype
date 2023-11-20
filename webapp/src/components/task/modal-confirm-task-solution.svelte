<script>
    import CloseIcon from '../../assets/svg/close_green_24px.svelte'
	import CheckIcon from '../../assets/svg/check_circle_outline_18px.svelte'

	import Icon from '../../assets/svg/arrow_forward_ios_14px.svelte'

	import { currentTask, userMeta, users } from '../../models/app'


	function toggleContentNode(node) {
    node.addEventListener('click', () => {
        let styleProperty = node.nextElementSibling.style.display;
        if (styleProperty === '') styleProperty = 'none';

        node.nextElementSibling.style.display = 
            styleProperty === 'none' ? 'flex' : 'none';
    });
}

let placeholder = writable('false')
let submit = writable('false')
let ready = writable('false')
</script>

<div class="modal">
    <div class="window">
        <div class="close"><CloseIcon/></div>
        <div class="label">Finished?</div>
        <div class="subtitle">By clicking submit, your answer will be saved. After that you can no longer edit your answer and continue with the next task.</div>
        <div class="solution-summary">
            <div class="collapsible" use:toggleContentNode>Question 1 
				<div class="icon"><Icon/></div>
			</div>
            <div class="content">
                <p>Content solution 1 placeholder</p>
            </div>
			<div class="line"></div>
            <div class="collapsible" use:toggleContentNode>Question 2
				<div class="icon"><Icon/></div>
			</div>
            <div class="content">
                <p>Content solution 2 placeholder</p>
            </div>
			<div class="line"></div>
            <div class="collapsible" use:toggleContentNode>Question 3
				<div class="icon"><Icon/></div>
			</div>
            <div class="content">
                <p>Content solution 3 placeholder</p>
            </div>
			<div class="line"></div>
            <div class="collapsible" use:toggleContentNode>Question 4
				<div class="icon"><Icon/></div>
			</div>
            <div class="content">
                <p>Content solution 4 placeholder</p>
            </div>
        </div>
        <div class="ckecker">

			{#if placeholder}
				{#each $users as user}
				<div class="bubble-not-checked" title={`${user.firstName} ${user.lastName}`}>
					{user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase()}
				</div>
				{/each}
			{:else}
				{#each $users as user}
				<div class="bubble-checked" title={`${user.firstName} ${user.lastName}`}>
					{user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase()}
				</div>
				{/each}
			{/if}


		</div>
        <div class="submit" on:click={ready}>Ready to submit!</div>
		<div class="submitted" on:click={submit}><CheckIcon/>Ready!</div>
    </div>
</div>

<style lang="scss">

    .modal{
		display: block;
		position: absolute;
		z-index: 1800;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow:hidden;
		background: #12121295;

    >.window{
		display: flex;
		flex-direction: column;
		position: relative;
		background-color: #004A3D;
		color: #34E5B0;
		margin: 5% auto;
		padding: 20px;
		border-radius: 10px;
		width: 515px;

        >.close{
			display: flex;
			margin-left: auto;
			cursor: pointer;
		}

        >.label{
			display: flex;
			font-size: 24px;
			align-self: center;
			margin-bottom: 5px;
			font-family: 'Ubuntu Bold'
		}

		>.subtitle{
			display: flex;
			text-align: center;
		}

		>.solution-summary{
			display: flex;
			width: 100%;
			flex-direction: column;
			margin-top: 15px;
			margin-bottom: 15px;


			>.collapsible{
				display: flex;

				font-size: 16px;
				font-family: 'Ubuntu Bold';
				width: 100%;
				cursor: pointer;

				>.icon{
					margin-left: auto;
					margin-right: 3px;
				}
			}

			>.content{
				display: none;
  				overflow: hidden;
			}

			>.line{
				display: flex;
				height: 2px;
				width: 100%;
				background-color: #2E7E66;
				margin-top: 10px;
				margin-bottom: 10px;
			}
		}

		>.ckecker{
			display: flex;
			gap: 10px;
			justify-content: center;

				>.bubble-not-checked{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30px;
				height: 30px;
				border-radius: 100px;
				background-color: #242424;
				color: #939393;
				font-size: 12px;
				cursor: default;
				}

				>.bubble-checked{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 30px;
					height: 30px;
					border-radius: 100px;
					background-color: #4FDB8F;
					color: #004A3D;
					font-size: 12px;
					cursor: default;        
				}
		}

        >.submit{
			display: flex;
			width: 100%;
			height: 44px;
			padding: 15px;
			box-sizing: border-box;
			background: #34E5B0;
			color:#033129;
			align-self: center;
			margin-top: 25px;
			border-radius: 5px;
			cursor: pointer;
			align-items: center;
			gap: 5px;
			justify-content: center;
		}

		>.submitted{
			display: flex;
			width: 100%;
			height: 44px;
			padding: 15px;
			box-sizing: border-box;
			background: transparent;
			color:#34E5B0;
			border: solid 1px #34E5B0; 
			align-self: center;
			margin-top: 25px;
			border-radius: 5px;
			cursor: pointer;
			align-items: center;
			gap: 5px;
			justify-content: center;
		}
	}
}
</style>