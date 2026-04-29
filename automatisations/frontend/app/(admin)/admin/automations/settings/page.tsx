import Link from 'next/link';

export default function AutomationSettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0a08] via-[#15110a] to-[#0b0a08] text-amber-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3 text-sm text-amber-100/60">
          <Link href="/admin/automations" className="hover:text-amber-300">
            ← Retour
          </Link>
          <span>/</span>
          <span className="text-amber-200">Réglages avancés</span>
        </div>

        <h1 className="mb-3 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-4xl font-bold text-transparent">
          Réglages des automatisations
        </h1>
        <p className="mb-10 text-amber-100/70">
          Configuration globale du système d&apos;automatisations Eventy.
        </p>

        <div className="space-y-6">
          <SettingBlock
            title="Mode dry-run global"
            description="Simule l'exécution de toutes les automatisations sans envoyer d'emails, SMS, virements ou commandes externes. Les actions sont loggées comme si elles étaient réelles."
            badge="Sécurité"
          >
            <Toggle envName="AUTOMATIONS_DRY_RUN" defaultEnabled={false} />
          </SettingBlock>

          <SettingBlock
            title="Modèle 82/18"
            description="Pourcentage de la marge nette reversée à l'indépendant créateur. Modifiable seulement par le PDG."
            badge="Finance"
          >
            <ReadOnlyValue label="Eventy" value="82%" />
            <ReadOnlyValue label="Créateur" value="18%" />
            <p className="mt-3 text-xs text-amber-100/50">
              Appliqué uniquement sur la marge nette, jamais sur le coût total.
            </p>
          </SettingBlock>

          <SettingBlock
            title="Marge par défaut"
            description="Pourcentage de marge brute par défaut sur les nouveaux voyages. Ajustable par créateur."
            badge="Pricing"
          >
            <ReadOnlyValue label="Marge par défaut" value="25%" />
            <ReadOnlyValue label="Arrondi prix" value="Multiple de 5€" />
            <ReadOnlyValue label="Frais Stripe" value="1,4% + 0,25€" />
          </SettingBlock>

          <SettingBlock
            title="Buffer NFC"
            description="Marge de sécurité sur les commandes de bracelets NFC."
            badge="NFC"
          >
            <ReadOnlyValue label="Buffer" value="+10%" />
            <ReadOnlyValue label="Délai estimé" value="7 jours" />
          </SettingBlock>

          <SettingBlock
            title="Seuils d'alerte admin"
            description="Triggers automatiques de notification vers les admins."
            badge="Monitoring"
          >
            <ReadOnlyValue label="Pic réservations" value="> 3× moy. 7j" />
            <ReadOnlyValue label="Annulations" value="> 5% / jour" />
            <ReadOnlyValue label="Paiements échoués" value="> 10% / jour" />
            <ReadOnlyValue label="Note moyenne 7j" value="< 3.5 ★" />
          </SettingBlock>
        </div>
      </div>
    </main>
  );
}

function SettingBlock({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-[#0b0a08] p-6 shadow-lg shadow-amber-500/5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-amber-100">{title}</h2>
          <p className="mt-1 text-sm text-amber-100/70">{description}</p>
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
          {badge}
        </span>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function ReadOnlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-500/10 bg-amber-500/5 px-4 py-2">
      <span className="text-sm text-amber-100/70">{label}</span>
      <span className="font-mono text-sm font-semibold text-amber-200">{value}</span>
    </div>
  );
}

function Toggle({ envName, defaultEnabled }: { envName: string; defaultEnabled: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-500/10 bg-amber-500/5 px-4 py-2">
      <code className="font-mono text-xs text-amber-300">{envName}</code>
      <span className="text-xs text-amber-100/50">
        {defaultEnabled ? 'activé' : 'désactivé'} par défaut
      </span>
      <span className="ml-auto rounded-full bg-amber-100/10 px-2 py-0.5 text-xs text-amber-100/60">
        env-driven
      </span>
    </div>
  );
}
