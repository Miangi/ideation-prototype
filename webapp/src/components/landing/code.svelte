<script>

</script>

<div class='input-code'>
    <input type="text" id="registration-code" placeholder="Your Registration Code">
    <div class="instruction">Once we start, please enter your registration code</div>
</div>

<style lang="scss">

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

    .instruction{
        display: flex;
		margin-top: 10px;
		color: #959595;
        width: 100%;
        justify-content: center;
	}

</style>