<script lang="ts">
    import History from '$lib/Chat/Settings/History/History.svelte';
    import CharacterSettings from '$lib/Chat/Settings/CharacterSetteing/CharacterSetting.svelte';
    import CharacterIntegrate from '$lib/Chat/Settings/CharacterIntegrate/CharacterIntegrate.svelte';
    import CharacterSelect from '$lib/Chat/Settings/CharacterSelect/CharacterSelect.svelte';
    export let backendUrl: string;

    // メニュー全体の表示
    let showMenu = false;
    let activeMenu = "";
    let showSubMenu = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }

    function setActiveMenu(menuName: string) {
        if (activeMenu == menuName) {
            activeMenu = "";
        } else {
            activeMenu = menuName;
        }
    }

</script>

<!-- lg以下でiconを表示する -->
<div class={`absolute top-16 left-0 z-40 ${showMenu ? 'bg-blue-50/80 shadow-md w-80' : ''}`}>
    <button on:click={toggleMenu} class="text-white px-4 py-2 rounded">
        <span class="material-icons base_icon">
            menu
        </span>
    </button>
    <div class={`min-w-24 relative -top-4 h-2/5  ${showMenu ? '' : 'hidden'}`}>
        <div class="flex flex-col justify-center w-1/2 mx-auto space-y-0.5">
            <button on:click={() => setActiveMenu('history')} class={`border-b-2 ${activeMenu === 'history' ? 'border-blue-300' : ''}`}>履歴</button>
            <button on:click={() => {setActiveMenu('character')}} class={`border-b-2 ${activeMenu.startsWith('character') ? 'border-blue-300' : ''}`}>キャラクター</button>
            <div class={`flex justify-center mx-auto pt-1 space-x-6 ${activeMenu.startsWith('character') ? '' : 'hidden'}`}>
                <button on:click={() => setActiveMenu('characterselect')} class={`border-b-2 ${activeMenu === 'characterselect' ? 'border-blue-300' : ''}`}>選択</button>
                <button on:click={() => setActiveMenu('charactersetting')} class={`border-b-2 ${activeMenu === 'charactersetting' ? 'border-blue-300' : ''}`}>設定</button>
                <button on:click={() => setActiveMenu('characterintegrate')} class={`border-b-2 ${activeMenu === 'characterintegrate' ? 'border-blue-300' : ''}`}>統合</button>
            </div>
        </div>
        {#if activeMenu === 'history'}
            <History backendUrl={backendUrl}/>
        {:else if activeMenu === 'charactersetting'}
            <CharacterSettings backendUrl={backendUrl}/>
        {:else if activeMenu === 'characterintegrate'}
            <CharacterIntegrate backendUrl={backendUrl}/>
        {:else if activeMenu === 'characterselect'}
            <CharacterSelect backendUrl={backendUrl}/>
        {/if}
    </div>
</div>
