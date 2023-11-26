<script>
	import WarningIcon from '../../assets/svg/warning_amber_18px.svelte'
	import autosize from 'svelte-autosize'
    import { userMeta, answers, setAnswerText } from '../../models/app.js'
    import { onMount, tick } from 'svelte'

	export let question
	export let index
	export let minWords

	let expanded = false
	let inputDom
	let inputText = $answers[index]?.text || ''
	let currentEditor
	let clearEditorTimer

	function toggle(){
		expanded = !expanded
	}

	function handleInput(){
		setAnswerText({ index, text: inputText })
	}

	onMount(() => {
		return answers.subscribe(
			answers => {
				let answer = answers[index]

				if(!answer)
					return

				let clearInMs = answer.lastEdit + 3000 - Date.now()

				if(clearInMs > 0){
					currentEditor = answer.lastEditor

					clearTimeout(clearEditorTimer)
					clearEditorTimer = setTimeout(
						() => currentEditor = null,
						clearInMs
					)
				}
				
				if(answer.lastEditor?.id !== $userMeta.id){
					inputText = answer.text
					tick().then(() => autosize.update(inputDom))
				}
			}
		)
	})

	$: words = inputText.length > 0 ? inputText.split(/\s+/g).length : 0
	$: editorIsMe = currentEditor ? currentEditor?.id === $userMeta.id : undefined
</script>

<div class="accord" on:click={toggle}>
	<span class="title">Question {index+1}: {question.title}</span>
	<div class="right">
		{#if currentEditor}
			<div class="editor">
				{currentEditor.firstName.slice(0, 1).toUpperCase() + currentEditor.lastName.slice(0, 1).toUpperCase()}
			</div>
		{/if}
		<span class={words < minWords && 'unsufficient'}>{words} / {minWords} words</span>
		<div class="toggle">{expanded ? '−' : '+'}</div>
	</div>
</div>
{#if expanded}
	<p>{question.text}</p>
	<textarea
		rows="3"
		disabled={editorIsMe === false}
		use:autosize 
		bind:value={inputText}
		bind:this={inputDom}
		on:input={handleInput}
	/>
	{#if words < minWords}
		<div class="too-short">
			<WarningIcon/> Your answer must have at least {minWords} words
		</div>
	{/if}
{/if}

<style lang="scss">
	.accord{
		display: flex;
		justify-content: space-between;
		flex-shrink: 0;
		align-items: center;
		cursor: pointer;

		.title{
			font-size: 16px;
			font-family: 'Ubuntu Bold'
		}

		.right{
			display: flex;
			align-items: center;
			font-size: 11px;
			gap: 5px;

			.unsufficient{
				color: #FF7878;
			}

			.editor{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 22px;
				height: 22px;
				border-radius: 100px;
				background-color: #191E49;
				color: #4F87DB;
				font-size: 10px;
				cursor: default;
				animation: blink 1.5s infinite linear;

				@keyframes blink{
					0% {
						opacity: 1;
					}
					50% {
						opacity: 0;
					}
					100% {
						opacity: 1;
					}
				}
			}
		}

		.toggle{
			font-size: 21px;
			width: 25px;
			text-align: center;
			position: relative;
			top: -2px;
		}
	}

	textarea{
		flex-shrink: 0;
		width: 100%;
		background-color: #033129;
		border-radius: 10px;
		padding-top: 5px;
		padding-left: 5px;
		padding-right: 5px;
		box-sizing: border-box;
		outline: none;
		border: none;
		resize: vertical;
		color: #34E5B0;

		&:disabled{
			cursor: not-allowed;
		}
	}

	.too-short{
		display: flex;
		margin-top: 5px;
		color: #FF7878;
		align-items: center;
		gap: 5px;
	}
</style>