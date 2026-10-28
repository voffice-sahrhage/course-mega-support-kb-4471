// One problem per ticket, counted the way the desk counts (CauseTable, causes.ts): reports by cause, per
// tenant. Reports the desk read as a one-day move (desk-notes.json) stay counted where they're filed and
// are also a problem of their own: they describe no day/month swap, so neither parser nor hint explains them.
import { groupByCause, readAs, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'one-day';

export const PROBLEM_LABEL: Record<Problem, string> = {
  parser: 'parser reads every date month first',
  hint: 'booking-v3 form hint says MM/DD/YYYY',
  'one-day': 'booking moves by exactly one day',
};

export type ProblemRow = {
  problem: Problem | 'unplaced';
  reports: number;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // For one-day: the cause the desk files these reports under.
  filedUnder?: string[];
};

export function problemRows(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: Report[]; rows: ProblemRow[] } {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const groups = groupByCause(merged, tenantOf);
  const rows: ProblemRow[] = groups.map((g) => ({
    problem: g.cause,
    reports: g.reports.length,
    tenants: g.tenants,
    firstSeen: g.firstSeen,
    lastSeen: g.lastSeen,
  }));
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) {
    const days = moved.map((r) => r.receivedAt.slice(0, 10)).sort();
    rows.push({
      problem: 'one-day',
      reports: moved.length,
      tenants: new Set(moved.map((r) => r.tenant)).size,
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
      filedUnder: groups.filter((g) => readAs(g, oneDayMove)).map((g) => g.cause),
    });
  }
  return { merged, rows };
}
