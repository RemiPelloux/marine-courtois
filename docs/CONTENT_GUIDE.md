# Ajouter du contenu

Tout le contenu vit dans `src/data/`, validé par des schémas Zod (`src/types/content.ts`, `src/types/portfolio.ts`).
Aucun composant n'est à modifier : on ajoute une entrée, les pages, les relations, le plan du site et les tests suivent.

Avant de pousser :

```bash
pnpm test         # vérifie notamment qu'aucun identifiant ne pointe dans le vide (danglingReferences)
pnpm build
```

Le site est bilingue (français à `/`, anglais à `/en`). Toute entrée ajoutée en français reçoit sa traduction dans
le fichier de même nom sous `src/data/en/`, avec le même `id` et seulement les champs de texte : les dates, DOI, liens
et chiffres ne sont jamais recopiés. Sans traduction, la page anglaise affiche le français et
`tests/unit/i18n-content.test.ts` échoue. Détails : `docs/I18N.md`.

Règle commune : **une information = une source**. Chaque entrée porte un champ `sources` qui renvoie à un identifiant de
`src/data/sources.ts`. Ce qui n'a pas de preuve publique utilise la source `owner` (« informations fournies par Marine
Courtois ») et s'affiche comme tel.

## Une publication

`src/data/publications.ts` → ajouter un objet au tableau `RAW_PUBLICATIONS`.

- `publicationType` : `article` (évalué par les pairs), `preprint` ou `these`. Les communications ne vont jamais ici.
- `doi`, `codeUrl`, `datasetUrl`, `pdfUrl` : les liens apparaissent automatiquement dans la fiche.
- La page `/publications/<slug>`, l'export BibTeX, la recherche, le plan du site et les données structurées
  `ScholarlyArticle` sont générés.

Pour une présentation en trois niveaux (Découvrir, Comprendre, Approfondir), ajouter une entrée à
`src/data/publication-depth.ts`, clé = `id` de la publication. Les résultats d'« Approfondir » reprennent le résumé publié,
sans aller au-delà.

## Une communication ou un poster

`src/data/communications.ts` → une entrée par notice HAL (`halId`, `url`, `type: "communication" | "poster"`).
Elle rejoint la frise, la liste de `/communications` et le décompte de la page d'accueil.

Pour une mise en avant (comme le poster de Cargèse) : créer une entrée dans `src/data/features.ts` et renseigner
`featureId` sur la communication. Le champ `note` décrit ce que HAL ne dit pas (format, mise en scène), avec son origine.

## Un projet, une application Shiny, une expérience de deep learning

`src/data/projects.ts`. Deux modèles de fiche existent déjà en brouillon : `deep-learning` et `application-shiny`.

1. Remplir `context`, `question`, `methods`, `toolIds`, `results` (uniquement ce qui a été montré), `limits`,
   `nextSteps`, `links`.
2. Choisir le statut réel : `publie`, `en-cours`, `prototype`, `exploration`, `demo` ou `archive`.
   Un résultat non publié reste « préliminaire » dans le texte.
3. Démonstration externe (Shiny, Hugging Face…) : `demoUrl`. Le lien s'ouvre dans un nouvel onglet ; si l'application
   est indisponible, la fiche reste lisible.
4. Expériences successives : tableau `experiments` (`date`, `title`, `method`, `outcome`, `status`).
5. Passer `visibility` de `draft` à `public`. Tant qu'un projet est `draft` ou `private`, il n'apparaît nulle part et sa
   page affiche la page « introuvable » (non indexée).

## Une vidéo, un GIF, une capture

1. Déposer le fichier dans `public/media/` (vidéo en MP4 H.264, image en WebP).
2. Le déclarer dans `src/data/media.ts` : `kind`, `src`, `width`, `height`, un `alt` qui décrit ce que l'on voit,
   une `caption`, un `credit`, et `poster` (image d'attente) pour une vidéo.
3. Référencer son `id` dans `mediaIds` d'un projet ou d'une mise en avant (`features.ts`).

## Une pièce du parcours (diplôme, stage, expérience)

`src/data/experiences.ts`. `label` (18 caractères au plus) s'imprime sur la pièce ; `date` place la pièce dans l'ordre
chronologique ; les compétences n'ont pas de date et coiffent la feuille. La silhouette se recalcule seule
(`leafMask`) : ajouter ou retirer une pièce ne casse rien.

## Un enseignement

`src/data/teaching.ts` → `RAW_ACTIVITIES` : intitulé, établissement, niveau, période, format, objectifs, méthodes,
supports. Rien n'est déduit du doctorat : la page affiche un état vide tant que la liste l'est.

## Une question émergente (axe D)

`src/data/questions.ts` : `axisId: "emergentes"`, la question, son contexte, son statut (`exploration`, `en-cours`…).
Elle apparaît sur `/recherche#questions-emergentes`, jamais présentée comme un résultat.

## Un outil

- Utilisé dans un code public : `src/data/skills.ts`, avec `evidence` (fichiers où il est importé).
- Utilisé hors du code public : `src/data/toolkit.ts` (`RAW_DECLARED`), affiché en pointillés.

Le puzzle de l'accueil compte exactement 20 outils et 9 thèmes (`src/data/domains.ts`, chacun en français et en
anglais) : Maths, Stats, Biologie et Écologie en croix autour de « Votre projet », puis Populations, Biocontrôle,
Modèles, Data & ML et Calcul sur la rangée du bas. Ajouter un outil ou un thème demande d'en retirer un, ou d'agrandir la
grille (`COLS` dans `src/lib/puzzle/layout.ts`).

## Les données des poissons

`src/data/generated/functional-responses.json` est produit depuis le dépôt Zenodo (CC BY 4.0) :

```bash
node scripts/data/extract-functional-responses.mjs chemin/vers/FR_data_invasive.csv
```

Même sélection que `Main_Script.R` : 269 estimations, 45 espèces.
