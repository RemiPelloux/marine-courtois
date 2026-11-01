<div align="center">

<img src="docs/assets/banner.svg" alt="Marine Courtois — Modéliser le vivant, simuler, analyser : tout s'assemble. Bannière animée : le modèle de fertilité résiduelle trace le déclin d'une population sauvage pendant les lâchers de mâles stériles." width="100%">

<h3>A Living Research Atlas</h3>

<p>Le portfolio scientifique de <b>Dr. Marine A. Courtois</b> — biologie mathématique, dynamique des populations,<br>technique de l'insecte stérile. Docteure de l'Université Côte d'Azur depuis le 27 novembre 2025.</p>

<p>
<img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-171B18?style=flat-square&logo=nextdotjs&logoColor=F5F2EB">
<img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript-strict-171B18?style=flat-square&logo=typescript&logoColor=F5F2EB">
<img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-171B18?style=flat-square&logo=tailwindcss&logoColor=F5F2EB">
<img alt="Tests" src="https://img.shields.io/badge/tests-169%20passing-2468B3?style=flat-square">
<img alt="WCAG 2.2 AA" src="https://img.shields.io/badge/WCAG-2.2%20AA-0B2D4F?style=flat-square">
</p>

<p>
<a href="#-en-mouvement">En mouvement</a> ·
<a href="#-la-science-qui-tourne-vraiment">La science</a> ·
<a href="#-le-site">Le site</a> ·
<a href="#-démarrer">Démarrer</a> ·
<a href="#-architecture">Architecture</a> ·
<a href="docs/">Documentation</a>
</p>

</div>

<br>

> **Ce portfolio ne dit pas que Marine sait modéliser : il fait tourner ses modèles.**
> Ses deux systèmes d'équations publiés sont transcrits depuis ses notebooks publics, recalculés en direct dans le
> navigateur et vérifiés contre ses propres figures. Chaque courbe mène à la publication, au DOI et au code d'origine.

<br>

## ◐ En mouvement

<div align="center">
<img src="docs/assets/tour.gif" alt="Visite animée du site : le puzzle des 20 outils s'assemble, la famille machine learning est mise en évidence, l'aquarium sature quand les proies abondent, puis les axes de recherche, la feuille du parcours, Transmettre et l'index des publications." width="100%">
<br>
<sub>Visite enregistrée dans le navigateur (41 s) — <a href="docs/assets/tour.mp4">version MP4 haute définition</a></sub>
</div>

<br>

## ◑ Le parcours

Chaque module du **Model Explorer** suit le même mouvement. Une compétence n'est jamais affirmée : elle est démontrée par une réalisation scientifique réelle.

<table>
<tr>
<td width="33%" valign="top">

### Observer
**le mécanisme**

Les hypothèses et les équations du modèle, telles qu'écrites dans le code publié, rendues avec KaTeX côté serveur.

</td>
<td width="33%" valign="top">

### Explorer
**les paramètres**

Intensité des lâchers, fertilité résiduelle, règle d'utilisation du sperme… les trajectoires sont recalculées à chaque mouvement de curseur.

</td>
<td width="33%" valign="top">

### Comprendre
**les résultats**

Une lecture chiffrée de la courbe, puis un accès direct à la **publication**, au **DOI**, au **code** et à la **méthodologie**.

</td>
</tr>
</table>

<br>

## ◒ La science qui tourne vraiment

| Modèle | Transcrit depuis | Vérification |
| :-- | :-- | :-- |
| **Fertilité résiduelle** · EDO à 3 variables (S, F, M) | [`Script_Manuscrit_SIT_RF.ipynb`](https://gitlab.com/marinecourtois/thesisData) | σ = 500 → F(300) ≈ 18 · 175 (δ = 1 %) · 47 (ε = 1 %), conformément à la figure du notebook |
| **Ré-accouplement** · EDO à 5 variables (L, M, F<sub>I</sub>, F<sub>F</sub>, S) | [`Compartmental_model_output_vAvril.ipynb`](https://gitlab.com/marinecourtois/thesisData) | Panneaux A et B : à σ = 450 000, « First » élimine la population, « Last » se stabilise vers 22 700 |
| **Modèle discret** F<sub>t+1</sub> = λF²/(F+S) | [`fig_chapter2_thesis.ipynb`](https://gitlab.com/marinecourtois/thesisData) | Équilibres 0 et S/(λ−1), diagramme en toile d'araignée |
| **Lâchers impulsionnels** | [`Notebook_part_impulsive_releases.ipynb`](https://gitlab.com/marinecourtois/thesisData) | Solution périodique analytique |
| **Individu-centré** (démonstrateur ×1/50) | [`script_ABM_batchrun.py`](https://gitlab.com/marinecourtois/sit_remating_abm) (Mesa) | Règles conservées, simplifications signalées sur la page |

Les tests de non-régression (`tests/unit/models.test.ts`) vérifient ces valeurs à chaque commit.
Détails : [`docs/SCIENTIFIC_VISUALIZATIONS.md`](docs/SCIENTIFIC_VISUALIZATIONS.md).

<br>

## ◓ Le site

<table>
<tr>
<td colspan="2"><img src="docs/assets/screens/hero.webp" alt="Accueil : titre « Modéliser le vivant, simuler, analyser : tout s'assemble. » et le puzzle des 20 outils autour des quatre portes (Recherche, Publications, Projets, Transmettre) et de la pièce « Votre projet »."></td>
</tr>
<tr>
<td colspan="2"><img src="docs/assets/screens/fish.webp" alt="L'aquarium : trois bancs de poissons chassent les mêmes proies ; le curseur de densité montre la saturation d'une réponse fonctionnelle."></td>
</tr>
<tr>
<td width="50%"><img src="docs/assets/screens/leaf.webp" alt="Parcours en feuille : 24 pièces vérifiables, de la tige (2022) à la pointe (compétences), avec la fiche de la pièce choisie."></td>
<td width="50%"><img src="docs/assets/screens/depth.webp" alt="Niveau « Approfondir » de l'article sur les réponses fonctionnelles : modèle, hypothèses, résultats publiés et limites."></td>
</tr>
<tr>
<td colspan="2"><img src="docs/assets/screens/model-explorer.webp" alt="Model Explorer : onglet Fertilité résiduelle avec les étapes Observer, Explorer et Comprendre."></td>
</tr>
<tr>
<td width="50%"><img src="docs/assets/screens/agents.webp" alt="Démonstrateur individu-centré : femelles colorées selon le contenu de leur spermathèque et dynamique de la population."></td>
<td width="50%"><img src="docs/assets/screens/code.webp" alt="Explorateur de code : extraits verbatim des notebooks, métadonnées et figure produite."></td>
</tr>
<tr>
<td width="50%"><img src="docs/assets/screens/toolkit.webp" alt="Pile d'outils de /outils : six couches en bleu Antibes, des langages au partage, machine learning compris, avec les logos des outils."></td>
<td width="50%"><img src="docs/assets/screens/timeline.webp" alt="Frise animée 2022–2026 : communications, posters, articles et soutenance placés à leur date exacte."></td>
</tr>
<tr>
<td width="50%"><img src="docs/assets/screens/axes.webp" alt="Axes de recherche A à C, et l'axe D des questions émergentes."></td>
<td width="50%"><img src="docs/assets/screens/publications.webp" alt="Index des publications : recherche, filtres par année, type et thème, tri et export BibTeX."></td>
</tr>
</table>

<p align="center">
<img src="docs/assets/screens/mobile-hero.webp" alt="Accueil sur mobile" width="260">&nbsp;&nbsp;&nbsp;
<img src="docs/assets/screens/mobile-explorer.webp" alt="Model Explorer sur mobile" width="260">
</p>

Huit univers, sept entrées de navigation (Vulgarisation et Enseignement partagent « Transmettre ») :

| Route | Contenu |
| :-- | :-- |
| `/` | Puzzle des 20 outils, profil, à la une (un article, le modèle individu-centré, l'explorateur), l'aquarium, axes de recherche A–D, parcours en feuille, transmettre, publications, contact |
| `/parcours` | Puzzle en feuille de 24 pièces vérifiables (doctorat, collaborations, articles, congrès, compétences), lecture chronologique, biographie |
| `/recherche` · `/recherche/[slug]` | Simuler, expérimenter, interpréter ; axes A (biocontrôle), B (comportements reproducteurs, individu-centré), C (invasions biologiques), D (questions émergentes) ; 6 thèmes détaillés |
| `/publications` · `/publications/[slug]` | 3 articles et la thèse ; recherche, filtres, tri, export BibTeX, référence copiable ; trois niveaux de lecture (Découvrir, Comprendre, Approfondir) avec modules interactifs |
| `/communications` | 12 communications et posters (HAL), frise animée, oraux et posters séparés, le poster à éléments rotatifs de Cargèse |
| `/vulgarisation` · `/enseignement` | Huit modules, de la population au modèle ; enseignements (à renseigner) et supports en accès libre |
| `/projets` · `/projets/[slug]` | Le laboratoire vivant : fiches avec degré d'avancement (publié, en cours, prototype, exploration, démonstration, archivé), démonstrations intégrées, brouillons non publiés |
| `/outils` | Pile d'outils, chaque outil relié à ses preuves dans le code et à ses réalisations |
| `/these` · `/laboratoire` · `/contact` | Explorateur de thèse ; Model Explorer, modèle individu-centré, code ; courriel protégé contre le spam |

Les anciennes adresses (`/a-propos`, `/methodes`, `/communication`) redirigent de façon permanente. Ajouter une publication,
un projet Shiny, une vidéo ou une pièce de parcours : voir [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

<br>

## ◔ Intégrité scientifique

```
  Faits vérifiés        Crossref · ORCID · HAL · theses.fr · DataCite · GitLab
  Explications          reformulées sans dépasser les sources
  Déclaré               outils hors code publié (R Shiny, SQL, Power BI, machine learning), projets en cours — affichés comme tels
  Illustratif           schéma TIS, démonstrateur ABM — signalés à l'écran
  Absent, à dessein     poste actuel, prix, financements, citations, équations décoratives, jauges de compétences
```

La provenance de chaque affirmation est tracée dans [`docs/CONTENT_SOURCES.md`](docs/CONTENT_SOURCES.md).

<br>

## ◕ Démarrer

```bash
corepack enable
pnpm install
pnpm dev                 # http://localhost:3000
```

| Commande | Rôle |
| :-- | :-- |
| `pnpm build` · `pnpm start` | build et serveur de production |
| `pnpm lint` · `pnpm typecheck` | ESLint · TypeScript strict |
| `pnpm test` | 81 tests Vitest (modèles, intégrité des relations, puzzles, citations BibTeX, recherche, aquarium, frise, adresse protégée, composants) |
| `pnpm test:e2e` | 88 tests Playwright, desktop 1440 px et mobile 390 px, dont 30 audits d'accessibilité axe WCAG 2.2 AA (après `pnpm build`) |
| `pnpm readme:banner` | régénère la bannière animée à partir du modèle |
| `pnpm readme:screens` · `pnpm readme:tour` | captures et visite vidéo (serveur de production sur `:3300`) |

En production, définissez `NEXT_PUBLIC_SITE_URL` (URL canoniques, sitemap, Open Graph).

<br>

## ● Architecture

```mermaid
flowchart LR
  subgraph Sources["Sources publiques"]
    NB["Notebooks Python<br/>thesisData · sit_remating_abm"]
    REG["Crossref · ORCID · HAL<br/>theses.fr · DataCite"]
  end
  subgraph Data["src/data — source unique, validée par Zod"]
    PUB[publications] --- RES[recherche] --- SK[compétences] --- CODE[code & figures]
  end
  subgraph Sci["src/lib/scientific"]
    RK4[RK4] --> RF[fertilité résiduelle] & REM[ré-accouplement] & KN[Knipling] & ABM[individu-centré]
  end
  NB -- transcription vérifiée --> Sci
  NB -- extraits & figures --> CODE
  REG -- métadonnées --> PUB
  Data --> Pages["Pages serveur<br/>Next.js App Router"]
  Sci --> Viz["Visualisations client<br/>SVG · Canvas · D3 · Motion"]
  Viz --> Pages
```

```
src/
├── app/                  15 routes · redirections · sitemap · robots · image Open Graph (le puzzle)
├── components/
│   ├── editorial/        hero, chapitres, en-têtes
│   ├── puzzle/           puzzle animé des outils (plateau serveur, pièces client)
│   ├── home/             profil, à la une, aquarium, axes, parcours, transmettre
│   ├── fish/ · parcours/ · publication/ · projects/ · vulgarisation/   modules signatures
│   ├── visualizations/   Model Explorer (explorer/) · ABM · graphiques
│   ├── interactions/     publications · compétences · thèse · code · contrôles
│   └── scientific/       KaTeX serveur · sources · sections
├── data/                 contenus typés et sourcés
├── i18n/                 libellés d'interface (prêts pour l'anglais)
├── lib/puzzle/ · fish/   géométrie des pièces (plateau, silhouette en feuille) ; simulation de l'aquarium
└── lib/scientific/       modèles portés depuis les notebooks
```

<br>

## ◖ Modifier le contenu

- **Publication** : ajouter un objet dans `src/data/publications.ts`. L'index, les filtres, la fiche, le sitemap et le JSON-LD suivent automatiquement.
- **Communication** : `RAW_COMMUNICATIONS`, dans le même fichier (avec l'identifiant HAL).
- **Axe de recherche** : `src/data/research.ts`. La page `/recherche/<slug>` est générée automatiquement.
- **Source** : `src/data/sources.ts`, puis `docs/CONTENT_SOURCES.md`.

`pnpm test` refuse toute référence croisée cassée (publication, code, figure ou source introuvable).

<br>

## ◗ Design

Papier sable `#F5F2EB`, encre bleu nuit `#0F1D2E`, un seul accent, le bleu Méditerranée `#2468B3` (et `#6FB3F2` sur les fonds sombres), réservé aux variables du modèle et aux actions,
chapitres sombres en **bleu Antibes** `#0B2D4F` et ses nuances (`#123A63`, `#1D4E80`, azur `#8FC1EA`). **Instrument Serif** pour les titres, **Montserrat** pour le texte et l'interface, monospace
réservé au code. Passe anti-slop avec [taste-skill](https://github.com/Leonxlnx/taste-skill) : pas de micro-libellés en
capitales, de dégradés, de verre, de cartes à icône ni de jauges. Le mouvement respecte `prefers-reduced-motion` et se met
en pause hors écran. Détails : [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

<br>

## Documentation

| | |
| :-- | :-- |
| [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | tokens, typographie, règles, mouvement |
| [`CONTENT_SOURCES.md`](docs/CONTENT_SOURCES.md) | provenance de chaque affirmation |
| [`SCIENTIFIC_VISUALIZATIONS.md`](docs/SCIENTIFIC_VISUALIZATIONS.md) | équations, paramètres, vérifications |
| [`IMPLEMENTATION.md`](docs/IMPLEMENTATION.md) | phases et rapport QA |

<br>

<div align="center">
<sub>Recherche, modèles, code et figures scientifiques © Marine A. Courtois — <a href="https://orcid.org/0009-0002-3623-1460">ORCID</a> · <a href="https://gitlab.com/marinecourtois">GitLab</a>.<br>
Polices Instrument Serif et Montserrat sous licence SIL Open Font License, intégrées à la bannière.</sub>
</div>
