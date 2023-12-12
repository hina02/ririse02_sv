<script lang="ts">
    import History from '$lib/Chat/Settings/History/History.svelte';
    import CharacterSettings from '$lib/Chat/Settings/CharacterSetteing/CharacterSetting.svelte';
    export let backendUrl: string;

    // メニュー全体の表示
    let showMenu = false;
    let activeMenu = "";

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
<div class={`absolute top-20 left-0 z-40 ${showMenu ? 'bg-blue-50/80 shadow-lg w-96' : ''}`}>
    <button on:click={toggleMenu} class="text-white px-4 py-2 rounded">
        <span class="material-icons base_icon">
            menu
        </span>
    </button>
    <div class={`min-w-24 relative h-2/5  ${showMenu ? '' : 'hidden'}`}>
        <div class="flex flex-col justify-start">
            <button on:click={() => setActiveMenu('history')}>履歴</button>
            <button on:click={() => setActiveMenu('charactersettings')}>キャラクター設定</button>
        </div>
        {#if activeMenu === 'history'}
            <History backendUrl={backendUrl}/>
        {:else if activeMenu === 'charactersettings'}
            <CharacterSettings backendUrl={backendUrl}/>
        {/if}
    </div>
</div>
