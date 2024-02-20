<script lang="ts">
  import type { MessageSchemaType } from '$lib/Chat/Schema'

  export let message: MessageSchemaType
</script>

<tr>
  <td>{message.timestamp.toLocaleString()}</td>
  <td><strong>{message.speaker}:</strong> {message.message}</td>
</tr>
