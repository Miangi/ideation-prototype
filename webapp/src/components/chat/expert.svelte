<script>
    import AIIcon from '../../assets/svg/ai-persona-in-chat.svelte'
    import OpenIcon from '../../assets/svg/open-expert.svelte'
    
    import { writable } from 'svelte/store';


    let isClicked = writable(false);

</script>

<div class="expert-container">
    <div class="expert-header">
        {#if isClicked}
        <AIIcon/>
        {/if}
        <div class="expert-label">
            Digital Health Nomade
        </div>
    </div>
    {#if !isClicked}
    <div class="open-info-button">
        <OpenIcon/>
    </div>
    {/if}
    {#if isClicked}
    <div class="expert-background">
        An experienced healthcare professional with intensive work in disease control and healthcare management. She has a deep knowledge of public health, disease trends and healthcare technology.
    </div>
    {/if}
</div>

<style>
    .expert-container{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: auto;
        gap: 20px;
        border: 1px solid #565656;
        border-radius: 15px;
        padding: 20px;

    }
    .expert-header{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .expert-label{
        font-size: 16px;
        font-family: 'Ubuntu Bold'
    }

    .open-info-button{
        align-self: center;
    }

    .expert-background{
        display: flex;
        color: #9E9E9E;
    }

    
</style>