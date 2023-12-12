<!-- Use for Popup data (e.g., reponse data)-->
<script lang="ts">
    export let value : any;
</script>

<div class="bg-white p-4 rounded-lg w-4/5 max-w-xl">
    <pre>{JSON.stringify(value, null, 2)}</pre>
</div>
