<script>
    import ArrowBack from "../../assets/svg/arrow_back.svelte";
</script>

<div class='input-name'>
    <div class= 'name-container'>
        <div class="back-icon">
            <ArrowBack/>
        </div>
        <div>
                <input type="text" id="name" placeholder="Your Name">
                <div class="instruction">This is for the bonus point, your ideas are saved anonymously</div>
        </div>
    </div>
</div>

<style lang="scss">
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

    .instruction{
        display: flex;
		margin-top: 10px;
		color: #959595;
        width: 100%;
        justify-content: center;
	}

</style>