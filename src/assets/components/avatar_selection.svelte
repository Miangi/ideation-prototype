<script>
	import { writable } from 'svelte/store';
	import AIAvatar from '../svg/ai_persona.svelte';
    import AIAvatarActive from '../svg/ai-persona-active.svelte';

    let isSelected = writable(false);
    let selectionIsClicked = writable(false);

    function select () {
        isSelected.set(true);
        selectionIsClicked.set(true);
        };

    function unselect () {
        isSelected.set(false);
        };


</script>

{#if $isSelected}

    <div class="component-avatar-selection-selected"on:click={unselect}>
        <div class="avatar-selection-selected">
            <div class="avatar-icon-selection-selected"><AIAvatarActive /></div>
            <div class="avatar-selection-description-selected">Avatar Occupation</div>
            <div class="avatar-selection-background-selected">Avatar Background</div>
        </div>
    </div>

{:else}
<div class="component-avatar-selection" on:click={select}>
	<div class="avatar-selection" id="select-avatar">
		<div class="avatar-icon-selection"><AIAvatar /></div>
		<div class="avatar-selection-description">Avatar Occupation</div>
		<div class="avatar-selection-background">Avatar Background</div>
	</div>
</div>
{/if}
<style>
	.component-avatar-selection {
		display: flex;
		width: 100%;
		height: auto;
        cursor: pointer;
	}

    #select-avatar:hover {
        display: flex;
        width: 200px;
        height: 90px;
        border: 2px solid #9CA4A9; 
        border-radius: 15px;
        justify-content: center;
        align-items: center;
        color: #fefefe;
        flex-direction: column;
        gap: 10px;
        background-color: #444444;
	}

            .avatar-selection{
                display: flex;
                width: 200px;
                height: 90px;
                border: 2px solid #565656;
                border-radius: 15px;
                justify-content: center;
                align-items: center;
                color: #b9b9b9;
                flex-direction: column;
                gap: 10px;
                background-color: #393939;
            }


            .avatar-selection-description{
                display: flex;
                position: relative;
                top: -5px;
            }


            .avatar-selection-background{
                display: none;
            }








        .component-avatar-selection-selected {
		display: flex;
		width: 100%;
		height: auto;
        cursor: pointer;
	}
            .avatar-selection-selected{
                display: flex;
                width: 200px;
                height: 90px;
                border-radius: 15px;
                justify-content: center;
                align-items: center;
                color: #19644D;
                flex-direction: column;
                gap: 10px;
                background-color: #34E5B0;
            }


            .avatar-selection-description-selected{
                display: flex;
                position: relative;
                top: -5px;
            }


            .avatar-selection-background-selected{
                display: none;
            }
</style>
