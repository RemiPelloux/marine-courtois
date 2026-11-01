# Marine Courtois — A Living Research Atlas

Portfolio scientifique de **Dr. Marine A. Courtois** (biologie mathématique, Université Côte d'Azur, 2025).
*Comprendre le vivant. Par le modèle.*

Le site n'affiche que des informations vérifiées. Les visualisations interactives exécutent les modèles publiés de Marine,
transcrits depuis ses notebooks publics et vérifiés contre ses propres figures.

## Démarrer

```bash
corepack enable
pnpm install
pnpm dev            # http://localhost:3000
```

| Commande | Rôle |
| --- | --- |
| `pnpm build` / `pnpm start` | build de production / serveur de production |
| `pnpm lint` · `pnpm typecheck` | ESLint · TypeScript strict |
| `pnpm test` | tests unitaires Vitest (modèles, données, composants) |
| `pnpm test:e2e` | tests Playwright, desktop 1440 px et mobile 390 px (lance `pnpm start` sur le port 3200 ; nécessite `pnpm build`) |
| `pnpm format` | Prettier |

Variable d'environnement de production : `NEXT_PUBLIC_SITE_URL` (URL canoniques, sitemap, Open Graph).

## Stack

Next.js 16 (App Router, Cache Components, rendu serveur par défaut) · React 19 · TypeScript strict · Tailwind CSS 4 ·
Motion · D3 (échelles et géométrie SVG) · KaTeX (rendu serveur) · Zod · Vitest · Playwright.
Polices : Instrument Serif (titres), Montserrat (texte et interface), IBM Plex Mono (blocs de code uniquement).

## Arborescence

```
src/
├── app/                 routes (/, /recherche, /recherche/[slug], /methodes, /publications, /publications/[slug],
│                        /these, /laboratoire, /a-propos, /contact) + sitemap, robots, opengraph-image
├── components/
│   ├── layout/          en-tête, pied de page
│   ├── editorial/       hero, chapitres, en-têtes de page
│   ├── scientific/      équations KaTeX, sources, sections serveur
│   ├── visualizations/  Living System, Model Explorer, simulateur individu-centré, graphiques
│   ├── interactions/    index des publications, explorateurs (compétences, thèse, code), contrôles
│   └── ui/
├── data/                SOURCE UNIQUE de tous les contenus (typés et validés par Zod)
├── lib/scientific/      modèles portés depuis les notebooks (RK4, fertilité résiduelle, ré-accouplement, Knipling, ABM)
└── types/content.ts     schémas Zod
docs/                    DESIGN_SYSTEM · CONTENT_SOURCES · SCIENTIFIC_VISUALIZATIONS · IMPLEMENTATION (rapport QA)
public/figures/          figures extraites des notebooks publics (WebP)
tests/unit · tests/e2e
```

## Modifier le contenu

**Ajouter une publication** : ajouter un objet dans `RAW_PUBLICATIONS` (`src/data/publications.ts`). Champs requis :
`id`, `slug`, `title`, `authors`, `year`, `summaryFr`, `questionFr`, `approachFr`, `themes`, `publicationType`,
`sourceUrl`, `featured`, `researchSlugs`, `sources` (identifiants de `src/data/sources.ts`). L'index, les filtres,
la page détaillée, le sitemap et les données structurées se mettent à jour automatiquement. `pnpm test` vérifie les
références croisées.

**Ajouter une communication** : `RAW_COMMUNICATIONS` dans le même fichier (avec l'identifiant HAL).

**Ajouter un axe de recherche** : `src/data/research.ts`. La page `/recherche/<slug>` est générée automatiquement.

**Ajouter une source** : `src/data/sources.ts`, puis la référencer et la documenter dans `docs/CONTENT_SOURCES.md`.

Règle : aucune affirmation scientifique sans source. Voir `docs/CONTENT_SOURCES.md`.

## Intégrations futures possibles

- Version anglaise : l'architecture est prête (contenus centralisés), mais aucun sélecteur FR/EN n'est affiché tant que
  les traductions ne sont pas complètes.
- Planche illustrée de *Drosophila suzukii* (illustration commandée ou image libre de droits, créditée).
- Formulaire de contact : seulement avec validation serveur, anti-spam et service de courriel configuré. Le lien
  `mailto:` reste la solution actuelle.
- Synchronisation automatique ORCID / HAL lors du build.
