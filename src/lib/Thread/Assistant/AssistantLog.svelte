<script>
    // 実際のアプリケーションでは、履歴のデータを外部からpropsで受け取るようにします。
    let logs = [
      { action: "Checked system status", time: "10 minutes ago" },
      { action: "Completed system maintenance", time: "1 hour ago" }
    ];
  </script>
  
  <aside class="bg-blue-100 dark:bg-blue-800 p-4 rounded-md shadow-md">
    <h2 class="text-xl font-bold text-blue-900 dark:text-blue-100">Assistant Log</h2>
    <ul>
      {#each logs as log}
        <li class="text-blue-500 dark:text-blue-400">
          {log.action} - {log.time}
        </li>
      {/each}
    </ul>
  </aside>
  