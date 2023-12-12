<!-- @neo4j_router.post("/create_update_node", tags=["label"])
def create_update_node_api(label: str, name: str, properties: dict): -->

<!-- propertis = {"name_variation": name, "speech_pattern": list,"description": str, ""...otherkeys} -->

<!-- 入力フォーム -->
<script lang="ts">
    import ListForm from '$lib/Utils/ListForm.svelte';
    import DictForm from '$lib/Utils/DictForm.svelte';
    import Modal from 'svelte-simple-modal';
    // export let backendUrl: string;
    let name: string = "";
    let name_variation: string[] = [];
    let speech_pattern: string[] = [];
    let properties = {};
  
    function addProperty() {
      const key = prompt("Enter the property key:");
      if (key && !properties[key]) {
        properties[key] = ""; // 初期値は空文字列
      }
    }
  
    function handleSubmit() {
      // APIへの送信処理をここに記述
      console.log(properties);
    }
</script>

<div class="absolute bg-blue-50 w-96 h-96 m-14 z-20 p-4">
  <form on:submit|preventDefault={handleSubmit}>

    {#each Object.keys(properties) as key (key)}
      <label>
        {key}:
        <input type="text" bind:value={properties[key]} />
      </label>
    {/each}
    <button type="button" on:click={addProperty}>Add Property</button>
    <button type="submit">Submit</button>
  </form>
    <div class="py-4 overflow-y-auto relative h-80">
      <Modal>
        <ListForm bind:list={name_variation} />
        <DictForm bind:dict={properties} />
      </Modal>
    </div>

    </div>
