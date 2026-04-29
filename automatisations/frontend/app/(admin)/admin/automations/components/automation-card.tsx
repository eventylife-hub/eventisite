'use client';

import { useState, useTransition } from 'react';

interface AutomationSetting {
  id: string;
  automationName: string;
  enabled: boolean;
  scheduleCron: string | null;
  lastRunAt: string | null;
  notes: string | null;
}

interface AutomationRun {
  id: string;
  automationName: string;
  status: 'running' | 'success' | 'failed' | 'skipped';
  startedAt: string;
  durationMs: number | null;
  itemsProcessed: number | null;
}

const NAME_LABELS: Record<string, string> = {
  'creator-invoices-monthly': 'Factures créateurs mensuelles',
  'vat-margin-monthly': 'TVA sur marge mensuelle',
  'fec-export-yearly': 'Export FEC annuel',
  'sms-j-minus-one': 'SMS rappel J-1',
  'notifications-tick': 'Notifications planifiées',
  'creator-daily-digest': 'Digest créateurs (jour)',
};

export function AutomationCard({
  setting,
  lastRun,
}: {
  setting: AutomationSetting;
  lastRun?: AutomationRun;
}) {
  const [enabled, setEnabled] = useState(setting.enabled);
  const [running, setRunning] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const label = NAME_LABELS[setting.automationName] ?? setting.automationName;
  const cron = setting.scheduleCron ?? '—';

  async function toggle() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/automations/${setting.automationName}/toggle`, {
          method: 'POST',
        });
        if (!res.ok) throw new Error('Toggle failed');
        const data = await res.json();
        setEnabled(data.enabled);
        setFeedback(data.enabled ? 'Activée' : 'Désactivée');
        setTimeout(() => setFeedback(null), 2500);
      } catch {
        setFeedback('Erreur');
      }
    });
  }

  async function runNow() {
    setRunning(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/automations/${setting.automationName}/run-now`, {
        method: 'POST',
      });
      const data = await res.json();
      setFeedback(`✓ ${data.itemsProcessed ?? 0} item(s) traité(s)`);
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('Erreur exécution');
    } finally {
      setRunning(false);
    }
  }

  const statusColor =
    lastRun?.status === 'success'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : lastRun?.status === 'failed'
        ? 'bg-red-500/20 text-red-300 border-red-500/30'
        : lastRun?.status === 'running'
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          : 'bg-amber-100/5 text-amber-100/50 border-amber-100/10';

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-6 transition ${
        enabled
          ? 'border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-[#0b0a08]'
          : 'border-amber-500/10 bg-[#0b0a08]/60 opacity-60'
      }`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl transition group-hover:bg-amber-500/20" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-amber-100">{label}</h3>
            <p className="mt-1 font-mono text-xs text-amber-100/50">{setting.automationName}</p>
          </div>
          <button
            type="button"
            onClick={toggle}
            disabled={isPending}
            className={`relative h-7 w-12 rounded-full transition ${
              enabled ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-amber-100/10'
            }`}
            aria-label={enabled ? 'Désactiver' : 'Activer'}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-[#0b0a08] shadow transition ${
                enabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        <p className="mb-4 text-sm text-amber-100/70">{setting.notes ?? '—'}</p>

        <dl className="mb-4 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <dt className="text-amber-100/50">Cron</dt>
            <dd className="font-mono text-amber-200">{cron}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-amber-100/50">Dernier run</dt>
            <dd className="text-amber-200">
              {lastRun ? new Date(lastRun.startedAt).toLocaleString('fr-FR') : 'Jamais'}
            </dd>
          </div>
          {lastRun && (
            <div className="flex justify-between">
              <dt className="text-amber-100/50">Items</dt>
              <dd className="text-amber-200">{lastRun.itemsProcessed ?? 0}</dd>
            </div>
          )}
        </dl>

        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColor}`}
          >
            {lastRun?.status ?? 'idle'}
          </span>
          <button
            type="button"
            onClick={runNow}
            disabled={running || !enabled}
            className="rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-1.5 text-xs font-semibold text-[#0b0a08] shadow-md shadow-amber-500/20 transition hover:from-amber-300 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? 'Exécution…' : 'Exécuter maintenant'}
          </button>
        </div>

        {feedback && (
          <p className="mt-3 rounded-md bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200">
            {feedback}
          </p>
        )}
      </div>
    </article>
  );
}
