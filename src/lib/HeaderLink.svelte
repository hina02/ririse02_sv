<script lang="ts">
  import { page } from '$app/stores'
  import { derived } from 'svelte/store'

  export let href: string
  export let className: string = ''

  // 現在のパスを取得
  const currentPath = derived(page, ($page) => $page.url.pathname)

  // アクティブなリンクかどうかを判定するリアクティブステートメント
  $: isActive =
    $currentPath === href || ($currentPath !== '/' && href !== '/' && $currentPath.startsWith(href))
</script>

<a {href} class="py-3 text-xl inline-block {className} {isActive ? 'active-link' : ''}">
  <slot />
</a>
