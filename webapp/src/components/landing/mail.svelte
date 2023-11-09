<script>
    import ArrowBack from "../../assets/svg/arrow_back.svelte";
</script>


<div class='input-mail'>
    <div class= 'mail-container'>
        <div class="back-mail-icon">
            <ArrowBack/>
        </div>
        <div>
                <input type="text" id="mail" placeholder="Your E-Mail">
                <div class="instruction">This is for the ChatGPT Plus competition</div>
                <div class="start-button-container">
                    <div class="start-button">Let's Go!</div>
                </div>
        </div>
    </div>
</div>

<style lang="scss">
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

</style>