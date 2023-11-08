<script>
    import URlogo from '../assets/svg/URlogo.svelte'

</script>

<div class="landing-container">
    <div class="logo-UR">
        <URlogo/>
    </div>
    <div class="welcome-message">
        <div class="label">Welcome to the study</div>
        <div class="subtext">You will be brainstorming with AI</div>
    </div>
    <div class="code-input-container">
        <div class="input">
            <input type="text" id="registration-code" placeholder="Your Registration Code">
        </div>
        <div class="instruction">Once we start, please enter your registration code</div>
    </div>
    <div class="wave-visual">wave</div>
</div>


<style>
.landing-container{
    display: flex;
    flex-direction:column;
    width: 100%;
    height: 100%;
}

    .logo-UR{
        display: flex;
        width: auto;
        margin-left: auto;
        margin-right: 25px;
        margin-top: 25px;
    }

    .welcome-message{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10%;
        gap: 5px;
        color: #34E5B0;

        & .label{
            font-size: 36px;
            font-family: 'Ubuntu Bold';
        }
    }

    .code-input-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 5%;

        & .input{
            display: flex;
        }

        & input{
            border: none;
            height: 44px;
            width: 35vh;
            background-color: transparent;
            border-bottom: solid #CACACA;
            justify-content: center;
            outline: none;
            color: #FEFEFE;
            text-align: center;
            font-size: 24px;
            font-family: 'Ubuntu Bold';
        }

        & ::placeholder {
            text-align: center;
            font-size: 24px;
            font-family: 'Ubuntu Bold';
            color: #3E3E3E;
            }

        & .instruction{
            margin-top: 10px;
            color: #959595;
        }
    }

    .wave-visual{
        display: flex;
    }

</style>