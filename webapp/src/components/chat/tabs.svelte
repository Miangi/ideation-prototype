<script>
    import CloseTabIcon from '../../assets/svg/close_inactive_tab_18px.svelte'
    import CloseActiveTabIcon from '../../assets/svg/close_tab_18px.svelte'
    import AddTabIcon from '../../assets/svg/add_tab_18px.svelte'
    import { chats, currentChat } from '../../models/app'

    function createChat(){

    }

    function selectChat(chat){

    }

    function removeChat(chat){

    }
</script>

<div class="tabs">
    {#each $chats as chat}  
        <div class={chat.id === $currentChat?.id ? 'tab-container active' : 'tab-container'} on:click={() => selectChat(chats)}>
            <div class="tab-title">{chat.title}</div>
            <div class="tab-close" on:click|stopPropagation={() => removeChat(chat)}>
                <CloseActiveTabIcon/>
            </div>
        </div>
    {/each}
    <div class="add-tab-container" on:click={createChat}>
        <AddTabIcon/>
    </div>
</div>

<style>
    .tabs {
        display: flex;
        background-color: #1d1d1d;
        width: auto;
        align-items: center;
        margin-left: 17.2em;
        min-height: 23px;
    }

                    .tab-close {
                        display: flex;
                        margin-left: 10px;
                        cursor: pointer;
                    }

                    .tab-container {
                        display: flex;
                        min-width: 20px;
                        height: 20px;
                        justify-content: center;
                        padding-left: 10px;
                        color: #9CA4A9;
                        cursor: pointer;
                    }

                    .tab-container.active {
                        border-bottom: solid 2px #3ea2ff;
                        color: #3ea2ff;
                    }

                    .add-tab-container {
                        display: flex;
                        width: auto;
                        margin-left: 5px;
                        height: 20px;
                        justify-content: center;
                        cursor: pointer;
                    }

                    .tab-close {
                        display: flex;
                        margin-left: 10px;
                        cursor: pointer;
                    }

</style>