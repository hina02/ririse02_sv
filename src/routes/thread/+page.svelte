<script lang="ts">
    import Threads from '$lib/Thread/Thread/Thread.svelte';
    import AssistantProfile from '$lib/Thread/Assistant/AssistantProfile.svelte';
    import SettingAssistant from '$lib/Thread/Assistant/AssistantSetting.svelte';
    import AssistantIcon from '$lib/Thread/Icon/AssistantIcon.svelte';
    import SettingFile from '$lib/Thread/FileSetting/FileSetting.svelte';
    import SettingThread from '$lib/Thread/Thread/ThreadSetting.svelte';
    import MessageView from '$lib/Thread/Message/MessageView.svelte';
    import MessageComposer from '$lib/Thread/Message/MessageComposer.svelte';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    // その他のスクリプト...
</script>
  
<!-- ここにHTMLコンテンツを追加 -->
<!-- レスポンシブコンテナ -->
<div class="grid min-h-screen gap-6 p-8 md:grid-cols-3 bg-blue-50 dark:bg-blue-900">
    <!-- サイドバー -->
    <aside class="space-y-4 bg-white dark:bg-blue-800 rounded-md p-4 shadow-md h-screen-14 overflow-y-auto">
        <AssistantProfile {backendUrl}/>
        <SettingAssistant {backendUrl}/>
        <AssistantIcon {backendUrl}/>
        <SettingFile {backendUrl}/>
    </aside>

    <!-- メインコンテンツ -->
    <div class="col-span-2 space-y-2 bg-white dark:bg-blue-800 rounded-md p-4 shadow-md h-screen-14">
        <Threads {backendUrl} />
        <SettingThread {backendUrl}/>
        <div class="h-4/6">
          <MessageView {backendUrl}/>
        </div>
        <div class="h-1/4 overflow-y-clip">
          <MessageComposer {backendUrl}/> 
        </div>
    </div>
</div>
