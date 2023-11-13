<script>
	import ArrowBack from '../../assets/svg/arrow_back.svelte';
	import Warning from '../../assets/svg/warning_amber_18px.svelte'
    import Spinner from '../spinner.svelte'

	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { get, post } from '@mwni/fetch'

	let step = 1
	let registrationCode = ''
	let registrationCodeChecking = false
	let registrationCodeInvalid = false
	let surname = ''
	let name = ''
	let email = ''
	let registering = false

	async function checkCode(){
		registrationCodeChecking = true

		try{
			let { valid } = await get({
				url: `${BACKEND_REST_URL}/check-code`,
				query: {
					code: registrationCode
				}
			})

			if(!valid)
				throw 'invalid'

			registrationCodeInvalid = false
			step = 2
			setTimeout(() => document.getElementById('surname').focus(), 100)
		}catch{
			registrationCodeInvalid = true
			setTimeout(() => document.getElementById('registration-code').focus(), 100)
		}finally{
			registrationCodeChecking = false
		}
	}

	onMount(() => {
		document.getElementById('registration-code').focus()
	})

	function handleKeyPress(event, input) {
		if (event.key === 'Enter') {
			switch (input) {
				case 'registrationCode':
					checkCode()
					break
				case 'surname':
					step = 3
					break
				case 'name':
					step = 4
					break
			}

			if(step <= 4) {
				setTimeout(() => {
					document.getElementById(['registration-code', 'surname', 'name', 'mail'][step - 1]).focus()
				})
			}
		}
	}

	function goBack() {
		step = Math.max(1, step - 1)
	}

	async function letsGo(){
		registering = true

		try{
			let { token } = await post({
				url: `${BACKEND_REST_URL}/register`,
				payload: {
					code: registrationCode,
					surname,
					name,
					email
				}
			})

			document.cookie = `token=${token}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toGMTString()}}`
			goto('/ideation')
		}catch(error){
			alert(`Could not register: ${error.message}. Please reload the page and try again.`)
		}
	}

	$: registrationCode = registrationCode.toUpperCase()
</script>

<div class="code-input-container">
		{#if step === 1}
			<div class='input-code'>
				<div class="input-wrapper">
					<input 
						type="text" 
						id="registration-code" 
						placeholder="Your Registration Code"
						disabled={registrationCodeChecking}
						maxlength="5"
						bind:value={registrationCode}
						on:keypress={(e) => handleKeyPress(e, 'registrationCode')}
					>
					{#if registrationCodeChecking}
						<div class="checking">
							<Spinner/>
						</div>
					{/if}
				</div>
				<div class="instruction">
					Once we start, please enter your registration code
				</div>
				{#if registrationCodeInvalid}
					<div class="error">
						<Warning/> The code you entered is incorrect
					</div>
				{/if}
			</div>
		{/if}
	
		{#if step === 2}
			<div class='input-surname'>
				<div class= 'surname-container'>
					<div class="back-icon" on:click={goBack}><ArrowBack/></div>
					<div>
						<input
							type="text"
							id="surname"
							placeholder="Your Surname"
							bind:value={surname}
							on:keypress={(e) => handleKeyPress(e, 'surname')}
						>
						<div class="instruction">This is for the bonus point, your ideas are saved anonymously</div>
					</div>
				</div>
			</div>
		{/if}
	
		{#if step === 3}
			<div class='input-name'>
				<div class= 'name-container'>
					<div class="back-icon" on:click={goBack}><ArrowBack/></div>
					<div>
						<input 
							type="text" 
							id="name" 
							placeholder="Your Name" 
							bind:value={name}
							on:keypress={(e) => handleKeyPress(e, 'name')}
						>
						<div class="instruction">This is for the bonus point, your ideas are saved anonymously</div>
					</div>
				</div>
			</div>
		{/if}
	
		{#if step === 4}
			<div class='input-mail'>
				<div class= 'mail-container'>
					<div class="back-mail-icon" on:click={goBack}><ArrowBack/></div>
					<div>
						<input 
							type="text" 
							id="mail" 
							placeholder="Your E-Mail"
							bind:value={email}
						>
						<div class="instruction">This is for the ChatGPT Plus competition</div>
						<div class="start-button-container">
							<div class={`start-button ${registering && 'disabled'}`} on:click={letsGo}>Let's Go!</div>
							{#if registering}
								<div class="registering">
									<Spinner/>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

<style lang="scss">
		
	.code-input-container{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 5%;

		.input-code{
			display: flex;
			flex-direction: column;
			align-items: center;

			.input-wrapper{
				position: relative;

				.checking{
					position: absolute;
					top: 15px;
					right: 0px;
				}
			}

			input{
					border: none;
					height: 44px;
					width: 380px;
					background-color: transparent;
					border-bottom: solid #CACACA;
					justify-content: center;
					outline: none;
					color: #FEFEFE;
					text-align: center;
					font-size: 24px;
					font-family: inherit;
					font-weight: bold;

					&::placeholder {
							text-align: center;
							font-size: 24px;
							font-weight: bold;
							color: #3E3E3E;
					}
			}

		}

			.input-surname{
					display: flex;
					flex-direction: column;
					align-items: center;

					.surname-container{
							display: flex;
							align-items: center;
							gap: 5px;
					}

									.back-icon{
											display: flex;
											margin-top: -15px;
											cursor: pointer;
									}

									input{
											border: none;
											height: 44px;
											width: 380px;
											background-color: transparent;
											border-bottom: solid #CACACA;
											justify-content: center;
											outline: none;
											color: #FEFEFE;
											text-align: center;
											font-size: 24px;
											font-family: inherit;
											font-weight: bold;

											&::placeholder {
													text-align: center;
													font-size: 24px;
													font-weight: bold;
													color: #3E3E3E;
											}
									}
		}

			.input-name{
					display: flex;
					flex-direction: column;
					align-items: center;

					.name-container{
							display: flex;
							align-items: center;
							gap: 5px;
					}

									.back-icon{
											display: flex;
											margin-top: -15px;
											cursor: pointer;
									}

									input{
											border: none;
											height: 44px;
											width: 380px;
											background-color: transparent;
											border-bottom: solid #CACACA;
											justify-content: center;
											outline: none;
											color: #FEFEFE;
											text-align: center;
											font-size: 24px;
											font-family: inherit;
											font-weight: bold;

											&::placeholder {
													text-align: center;
													font-size: 24px;
													font-weight: bold;
													color: #3E3E3E;
											}
									}
		}

			.input-mail{
					display: flex;
					flex-direction: column;
					align-items: center;

					.mail-container{
							display: flex;
							align-items: center;
							gap: 5px;
					}

									.back-mail-icon{
											display: flex;
											margin-top: -85px;
											cursor: pointer;
									}

									input{
											border: none;
											height: 44px;
											width: 380px;
											background-color: transparent;
											border-bottom: solid #CACACA;
											justify-content: center;
											outline: none;
											color: #FEFEFE;
											text-align: center;
											font-size: 24px;
											font-family: inherit;
											font-weight: bold;

											&::placeholder {
													text-align: center;
													font-size: 24px;
													font-weight: bold;
													color: #3E3E3E;
											}
									}
		}

		.instruction{
			display: flex;
			margin-top: 10px;
			color: #959595;
			width: 100%;
			justify-content: center;
		}

		.start-button-container{
			display: flex;
			margin-top: 10px;
			color: #959595;
			width: 100%;
			justify-content: center;
			position: relative;

			.start-button{
				display: flex;
				margin-top: 15px;
				width: 100%;
				height: 44px;
				align-items: center;
				color: #959595;
				justify-content: center;
				background-color:#083A2B80;
				color: #34E5B0;
				border-radius: 10px;
				cursor: pointer;

				&.disabled{
					pointer-events: none;
					background-color: #2b2b2b;
					color: #575757;
				}
			}

			.registering{
				position: absolute;
				top: 27px;
				right: 0px;
			}
		}

		.error{
			display: flex;
			align-items: center;
			color: #FF7878;
			margin-top: 5px;
		}
	}
</style>