<script lang="ts">
  import data from '#lib/data/tickets-4471.json';
</script>

<table>
  <thead><tr><th>ticket</th><th>problem</th></tr></thead>
  <tbody>
    {#each data.tickets as t (t.issue)}
      <tr>
        <td><a href="{data.repo}/issues/{t.issue}">issue {t.issue}</a></td>
        <td>{t.problem} <code>{t.cause}</code></td>
      </tr>
    {/each}
  </tbody>
</table>
