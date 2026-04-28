import { Suspense } from 'react';
import Link from 'next/link';
import { AutomationCard } from './components/automation-card';

export const metadata = {
  title: 'Automatisations · Admin Eventy',
  description: 'Pilotage des automatisations Eventy — cron, workflow, comptabilité.',
};

interface AutomationSetting {
  id: string;
  automationName: string;
  enabled: boolean;
  scheduleCron: string | null;
  lastRunAt: string | null;
  nextRunAt: string | null;
  notes: string | null;
}

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

const FALLBACK_AUTOMATIONS: AutomationSetting[] = [
  {
    id: 'creator-invoices-monthly',
    automationName: 'creator-invoices-monthly',
    enabled: true,
    scheduleCron: '0 3 1 * *',
    lastRunAt: null,
    nextRunAt: null,
    notes: 'Factures créateurs mensuelles — 18% sur la marge',
  },
  {
    id: 'vat-margin-monthly',
    automationName: 'vat-margin-monthly',
    enabled: true,
    scheduleCron: '0 2 19 * *',
    lastRunAt: null,
    nextRunAt: null,
    notes: 'Calcul TVA sur marge — déclaration CA3',
  },
  {
    id: 'fec-export-yearly',
    automationName: 'fec-export-yearly',
    enabled: true,
    scheduleCron: '0 0 31 12 *',
    lastRunAt: null,
    nextRunAt: null,
    notes: 'Export FEC annuel — Article A47 A-1 LPF',
  },
  {
    id: 'sms-j-minus-one',
    automationName: 'sms-j-minus-one',
    enabled: true,
    scheduleCron: '0 18 * * *',
    lastRunAt: null,
    nextRunAt: null,
    notes: 'SMS rappel arrêt bus J-1',
  },
  {
    id: 'notifications-tick',
    automationName: 'notifications-tick',
    enabled: true,
    scheduleCron: '*/15 * * * *',
    lastRunAt: null,
    nextRunAt: null,
    notes: 'Dispatch des notifications planifiées',
  },
  {
    id: 'creator-daily-digest',
    automationName: 'creator-daily-digest',
    enabled: true,
    scheduleCron: '0 9 * * *',
    lastRunAt: null,
    nextRunAt: null,
    notes: 'Digest quotidien créateurs (réservations 24h)',
  },
];

async function fetchSettings(): Promise<AutomationSetting[]> {
  try {
    const res = await fetch(`${process.env.API_URL ?? ''}/admin/automations/settings`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return FALLBACK_AUTOMATIONS;
    return (await res.json()) as AutomationSetting[];
  } catch {
    return FALLBACK_AUTOMATIONS;
  }
}

async function fetchRecentRuns(): Promise<AutomationRun[]> {
  try {
    const res = await fetch(`${process.env.API_URL ?? ''}/admin/automations/runs?limit=20`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    return (await res.json()) as AutomationRun[];
  } catch {
    return [];
  }
}

export default async function AutomationsPage() {
  const [settings, runs] = await Promise.all([fetchSettings(), fetchRecentRuns()]);
  const enabledCount = settings.filter((s) => s.enabled).length;
  const successRate =
    runs.length > 0
      ? Math.round((runs.filter((r) => r.status === 'success').length / runs.length) * 100)
      : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0a08] via-[#15110a] to-[#0b0a08] text-amber-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12 flex flex-col gap-4 border-b border-amber-500/20 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
              Eventy · Admin
            </p>
            <h1 className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Automatisations
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-amber-100/70">
              Tout ce que la machine fait pour vous. Chaque automatisation est traçable,
              désactivable, et exécutable manuellement à la demande.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/automations/runs"
              className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/10"
            >
              Historique
            </Link>
            <Link
              href="/admin/automations/settings"
              className="rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-sm font-semibold text-[#0b0a08] shadow-lg shadow-amber-500/20 transition hover:from-amber-300 hover:to-yellow-400"
            >
              Réglages avancés
            </Link>
          </div>
        </header>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Automatisations actives"
            value={`${enabledCount} / ${settings.length}`}
            hint="Toggle individuel possible"
          />
          <StatCard
            label="Taux de succès (20 dernières)"
            value={successRate === null ? '—' : `${successRate}%`}
            hint={runs.length === 0 ? 'Aucun run encore' : `${runs.length} runs analysés`}
          />
          <StatCard
            label="Items traités (24h)"
            value={String(
              runs
                .filter((r) => Date.now() - new Date(r.startedAt).getTime() < 86_400_000)
                .reduce((sum, r) => sum + (r.itemsProcessed ?? 0), 0),
            )}
            hint="Cumul cron de la journée"
          />
        </section>

        <Suspense fallback={<p className="text-amber-100/50">Chargement…</p>}>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {settings.map((s) => (
              <AutomationCard
                key={s.id}
                setting={s}
                lastRun={runs.find((r) => r.automationName === s.automationName)}
              />
            ))}
          </section>
        </Suspense>

        <section className="mt-14 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-6">
          <h2 className="mb-4 text-lg font-semibold text-amber-200">Règles d&apos;or</h2>
          <ul className="space-y-2 text-sm text-amber-100/80">
            <li>· Tout est traçable dans <code className="text-amber-300">audit_log_automations</code></li>
            <li>· Tout est désactivable individuellement</li>
            <li>· Idempotence : exécuter 2× = exécuter 1×</li>
            <li>· L&apos;humain garde la décision finale (modération, devis, factures &gt; 10 000€)</li>
            <li>· Modèle 82/18 appliqué uniquement sur la marge — jamais sur le coût total</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-[#0b0a08] p-6 shadow-lg shadow-amber-500/5">
      <p className="text-xs font-medium uppercase tracking-wider text-amber-400/70">{label}</p>
      <p className="mt-2 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-3xl font-bold text-transparent">
        {value}
      </p>
      <p className="mt-1 text-xs text-amber-100/50">{hint}</p>
    </div>
  );
}
