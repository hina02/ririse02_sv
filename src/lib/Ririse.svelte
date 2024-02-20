<script lang="ts">
  import { withVoice } from '$lib/Chat/Store'
  let showImage = true
</script>

{#if showImage}
  <div
    class="fixed pointer-events-none transition-all duration-1000
                w-[48rem] right-[-8rem]
                md:w-[52rem]
                lg:w-[64rem]"
  >
    <img
      src="/character/full_image/standard_blink.svg"
      alt="ririse_standard_blink"
      class="absolute sm:right-1/4 lg:right-32"
    />
  </div>
{/if}
<footer class="fixed bottom-2 right-16 z-10">
  <button
    class="material-icons text-blue-300 scale-125 hover:text-blue-400 text-sm"
    on:click={() => (showImage = !showImage)}
  >
    {#if showImage}
      visibility
    {:else}
      visibility_off
    {/if}
  </button>
  <button
    class="material-icons text-blue-300 scale-125 hover:text-blue-400 text-sm"
    on:click={() => ($withVoice = !$withVoice)}
  >
    {#if $withVoice}
      volume_up
    {:else}
      volume_off
    {/if}
  </button>
</footer>
