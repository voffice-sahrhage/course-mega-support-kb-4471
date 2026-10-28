<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import tickets from '#lib/data/tickets-4471.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { problemRows, PROBLEM_LABEL } from '#lib/kb/problems';

  let { ticket }: { ticket: number } = $props();

  const split = $derived(problemRows(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const issueOf = (p: string) => (tickets.tickets as Record<string, number>)[p];
</script>

<p class="sum">
  <strong>{split.merged.length}</strong> reports merged into #{ticket} ·
  <strong>{split.rows.length}</strong> {split.rows.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.rows as g (g.problem)}
      <tr class:open={!issueOf(g.problem)}>
        <td>{g.problem === 'unplaced' ? 'no tenant on file' : PROBLEM_LABEL[g.problem]} <code>{g.problem}</code></td>
        <td>{g.reports}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if issueOf(g.problem)}
            <a href="{tickets.repo}/issues/{issueOf(g.problem)}">issue {issueOf(g.problem)}</a>
          {:else}
            no ticket yet
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.rows as g (g.problem)}
  {#if g.filedUnder}
    <p class="note">The {g.reports} <code>{g.problem}</code> reports are also counted under <code>{g.filedUnder.join(', ')}</code>, where the desk files them by tenant.</p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
