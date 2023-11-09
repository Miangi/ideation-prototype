<script>
    import ArrowBack from '../../assets/svg/arrow_back.svelte';

    import { onMount } from 'svelte';

        let step = 1;
        let registrationCode = '';
        let surname = '';
        let name = '';
        let mail = '';
        let inputData = [];

        // erster input ist registrierungscode
        onMount(() => {
        document.getElementById('registration-code').focus();
        });

        // enter taste triggert nächsten case
        function handleKeyPress(event, input) {
        if (event.key === 'Enter') {
            switch (input) {
            case 'registrationCode':
                registrationCode = event.target.value;
                step = 2;
                break;
            case 'surname':
                surname = event.target.value;
                step = 3;
                break;
            case 'name':
                name = event.target.value;
                step = 4;
                break;
            }

            // nächstes Inputfeld
            if(step <= 4) {
            setTimeout(() => {
                document.getElementById(['registration-code', 'surname', 'name', 'mail'][step - 1]).focus();
            });
            }
        }
        }

        // erfassen von E-Mail und speichern in Array
        function handleStartButtonClick() {
        mail = document.getElementById('mail').value;
        inputData = [registrationCode, surname, name, mail];
        
        console.log(inputData)
        }

        function goBack() {
            step = Math.max(1, step - 1);
        }

</script>

<div class="code-input-container">
    {#if step === 1}
      <div class='input-code'>
        <input type="text" id="registration-code" placeholder="Your Registration Code" on:keypress={(e) => handleKeyPress(e, 'registrationCode')}>
        <div class="instruction">Once we start, please enter your registration code</div>
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
            <input type="text" id="name" placeholder="Your Name" on:keypress={(e) => handleKeyPress(e, 'name')}>
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
            <input type="text" id="mail" placeholder="Your E-Mail">
            <div class="instruction">This is for the ChatGPT Plus competition</div>
            <div class="start-button-container">
              <div class="start-button" on:click={handleStartButtonClick}>Let's Go!</div>
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
    }

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
            }
}
</style>