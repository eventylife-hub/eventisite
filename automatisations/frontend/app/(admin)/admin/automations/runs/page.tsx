import Link from 'next/link';

interface AutomationRun {
  id: string;
  automationName: string;
  status: 'running' | 'success' | 'failed' | 'skipped';
  startedAt: string;
  endedAt: string | null;
  durationMs: number | null;
  itemsProcessed: number | null;
  error: string | null;
}

async function fetchRuns(): Promise<AutomationRun[]> {
  try {
    const res = await fetch(`${process.env.API_URL ?? ''}/admin/automations/runs?limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return (await res.json()) as AutomationRun[];
  } catch {
    return [];
  }
}

export default async function AutomationRunsPage() {
  const runs = await fetchRuns();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0a08] via-[#15110a] to-[#0b0a08] text-amber-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3 text-sm text-amber-100/60">
          <Link href="/admin/automations" className="hover:text-amber-300">
            ← Retour
          </Link>
          <span>/</span>
          <span className="text-amber-200">Historique des exécutions</span>
        </div>

        <h1 className="mb-8 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-4xl font-bold text-transparent">
          Historique des runs
        </h1>

        {runs.length === 0 ? (
          <p className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-8 text-center text-amber-100/60">
            Aucun run enregistré pour le moment.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-950/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-500/20 text-left text-xs uppercase tracking-wider text-amber-400/70">
                  <th className="px-4 py-3">Automatisation</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Démarré</th>
                  <th className="px-4 py-3">Durée</th>
                  <th className="px-4 py-3 text-right">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10">
                {runs.map((r) => (
                  <tr key={r.id} className="transition hover:bg-amber-500/5">
                    <td className="px-4 py-3 font-mono text-xs text-amber-200">
                      {r.automationName}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-amber-100/70">
                      {new Date(r.startedAt).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-amber-100/70">
                      {r.durationMs !== null ? `${(r.durationMs / 1000).toFixed(1)}s` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-200">
                      {r.itemsProcessed ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: AutomationRun['status'] }) {
  const map = {
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    failed: 'bg-red-500/20 text-red-300 border-red-500/30',
    running: 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse',
    skipped: 'bg-amber-100/10 text-amber-100/50 border-amber-100/20',
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}
