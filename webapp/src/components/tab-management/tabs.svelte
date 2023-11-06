<script>
    import CloseTabIcon from '../../assets/svg/close_inactive_tab_18px.svelte';
    import CloseActiveTabIcon from '../../assets/svg/close_tab_18px.svelte';
    import AddTabIcon from '../../assets/svg/add_tab_18px.svelte';



    //tab management
        let tabs = [{ id: 1, title: 'Ideation 1'}];
        let activeTab = tabs[0];

        function addTab() {
        const id = Math.random()
        .toString(16)
        .slice(2, 10)
        .toUpperCase()

        const newTab = { id, title: `Ideation` };
        tabs = [...tabs, newTab];
        activeTab = newTab;
        }


        function removeTab(id) {
        tabs = tabs.filter(tab => tab.id !== id);
        if (activeTab.id === id) {
            activeTab = tabs[0] || {};
        }
        }

        function selectTab(tab) {
        activeTab = tab;
        }



</script>

<div class="chat-tabs-container">
    {#each tabs as tab (tab.id)}  
        <div class={activeTab.id === tab.id ? 'tab-container active' : 'tab-container'} on:click={() => selectTab(tab)}>
            <div class="tab-title">{tab.title}</div>
            <div class="tab-close" on:click|stopPropagation={() => removeTab(tab.id)}><CloseActiveTabIcon /></div>
        </div>
    {/each}
    <div class="add-tab-container" on:click={addTab}><AddTabIcon /></div>
</div>

<style>
    .chat-tabs-container {
        display: flex;
        background-color: #1d1d1d;
        width: auto;
        align-items: center;
        margin-left: 17.2em;
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