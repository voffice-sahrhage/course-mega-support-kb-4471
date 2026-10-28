<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import tickets from '#lib/data/tickets-4471.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { groupByProblem, PROBLEM_LABEL } from '#lib/kb/problems';

  let { ticket }: { ticket: number } = $props();

  const split = $derived(groupByProblem(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const issueOf = (p: string) => (tickets.tickets as Record<string, number>)[p];
  const covered = $derived(split.groups.filter((g) => issueOf(g.problem)).reduce((n, g) => n + g.reports.length, 0));
</script>

<p class="sum">
  <strong>{split.merged.length}</strong> reports merged into #{ticket} ·
  <strong>{split.groups.length}</strong> {split.groups.length === 1 ? 'problem' : 'problems'} ·
  <strong>{covered}</strong> covered by a ticket of their own
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      <tr class:open={!issueOf(g.problem)}>
        <td>{g.problem === 'unplaced' ? 'no tenant on file' : PROBLEM_LABEL[g.problem]} <code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
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

<style>
  .sum { font-size: 1.1rem; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
