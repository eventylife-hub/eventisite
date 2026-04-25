# TODO — Architecture Caravanes & Tribus
*Créé : 2026-04-25*

## Naming officiel

| Terme game | Nom Eventy | Description |
|-----------|-----------|-------------|
| Guilde / Clan | **Caravane** | Groupe de 50-200 voyageurs |
| Sous-groupe | **Tribu** | Petits groupes d'amis (5-15 personnes) |
| Alliance | **Alliance** (futur) | Regroupement de caravanes |
| Guild Master | **Meneur de Caravane** | Chef & animateur |
| Officer | **Officier** | Assistants du Meneur |

**Rationale du nom "Caravane"** : Lié à l'univers voyage d'Eventy. Une caravane historique = groupe de voyageurs qui s'unissent pour traverser des territoires difficiles ensemble. Colle parfaitement à l'âme d'Eventy (voyage de groupe, esprit collectif, on va plus loin ensemble).

---

## Pages créées (2026-04-25)

| Route | Fichier | Statut |
|-------|---------|--------|
| `/jeux/caravanes` | `jeux/caravanes/page.tsx` | ✅ Créé |
| `/jeux/caravanes/[id]` | `jeux/caravanes/[id]/page.tsx` | ✅ Créé |
| `/jeux/caravanes/[id]/raid` | `jeux/caravanes/[id]/raid/page.tsx` | ✅ Créé |
| `/jeux/tribus` | `jeux/tribus/page.tsx` | ✅ Créé |
| `/jeux/classement-caravanes` | `jeux/classement-caravanes/page.tsx` | ✅ Créé |

## Pages à créer (backlog)

- [ ] `/jeux/caravanes/creer` — formulaire création caravane (nom, emblème, devise, tags, règles)
- [ ] `/jeux/caravanes/[id]/gestion` — panneau admin Meneur (membres, rôles, invitations, kick)
- [ ] `/jeux/caravanes/[id]/chat` — chat dédié caravane (temps réel)
- [ ] `/jeux/tribus/[id]` — page tribu individuelle avec chat
- [ ] `/jeux/tribus/creer` — créer une tribu

---

## Modèle de données (à implémenter backend)

```prisma
model Caravane {
  id          String   @id @default(cuid())
  nom         String
  embleme     String   // emoji
  devise      String?
  description String?
  niveau      Int      @default(1)
  xp          Int      @default(0)
  rarity      CaravaneRarity @default(COMMON)
  ouverte     Boolean  @default(true)
  membresMax  Int      @default(100)
  meneurId    String
  meneur      User     @relation("CaravaneMeneur", fields: [meneurId], references: [id])
  membres     CaravaneMembre[]
  tribus      Tribu[]
  raids       RaidCaravane[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CaravaneMembre {
  id         String   @id @default(cuid())
  caravaneId String
  userId     String
  role       MembreRole @default(MEMBRE)
  xpApporte  Int      @default(0)
  rejointLe  DateTime @default(now())
  caravane   Caravane @relation(fields: [caravaneId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
  @@unique([caravaneId, userId])
}

model Tribu {
  id         String @id @default(cuid())
  nom        String
  embleme    String
  devise     String?
  caravaneId String
  caravane   Caravane @relation(fields: [caravaneId], references: [id])
  membres    TribudMembre[]
  chefId     String
  niveau     Int @default(1)
  xp         Int @default(0)
}

enum CaravaneRarity {
  COMMON RARE EPIC LEGENDARY
}

enum MembreRole {
  MENEUR OFFICIER MEMBRE
}
```

---

## API endpoints à créer

```
GET    /api/caravanes                    — liste + filtres
POST   /api/caravanes                    — créer (auth)
GET    /api/caravanes/:id                — détail + membres
POST   /api/caravanes/:id/rejoindre      — rejoindre
DELETE /api/caravanes/:id/quitter        — quitter
PUT    /api/caravanes/:id                — modifier (Meneur seul)
POST   /api/caravanes/:id/inviter        — inviter un membre
PUT    /api/caravanes/:id/membres/:uid   — changer rôle
DELETE /api/caravanes/:id/membres/:uid   — exclure
GET    /api/caravanes/:id/chat           — messages
POST   /api/caravanes/:id/chat           — envoyer message
GET    /api/caravanes/classement         — classement global
GET    /api/tribus                       — mes tribus
POST   /api/tribus                       — créer
GET    /api/tribus/:id                   — détail
```

---

## Système de niveaux Caravane

| Niveau | XP requis | Avantages |
|--------|-----------|-----------|
| 1-5 | 0–5 000 | Max 50 membres, 5 tribus |
| 6-10 | 5 000–20 000 | Max 80 membres, 8 tribus |
| 11-20 | 20 000–80 000 | Max 120 membres, 12 tribus, raids Héroïques |
| 21-30 | 80 000–200 000 | Max 150 membres, raids Mythiques |
| 31+ | 200 000+ | Max 200 membres, raids Légendaires, emblème animé |

## Rareté Caravane (calculée automatiquement)

- **Commune** (Niv. 1-5) : border grise
- **Rare** (Niv. 6-15) : border bleue
- **Épique** (Niv. 16-25) : border violette + lueur
- **Légendaire** (Niv. 26+) : border or + particules animées

---

## XP Caravane — sources

| Action | XP caravane |
|--------|------------|
| Membre complète un défi | +10 XP |
| Membre gagne un tournoi | +50 XP |
| Raid gagné (Normal) | +200 XP |
| Raid gagné (Héroïque) | +500 XP |
| Raid gagné (Mythique) | +1 200 XP |
| Raid gagné (Légendaire) | +3 000 XP |
| Tribu créée | +100 XP |
| Membre recrue actif | +25 XP |
