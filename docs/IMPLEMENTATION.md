# Implémentation et rapport QA

## Phases
1. **Fondations** : Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind 4, schémas Zod
   (`src/types/content.ts`), jeu de données sourcé (`src/data`).
2. **Science** : modèles portés depuis les notebooks publics (`src/lib/scientific`) et vérifiés contre leurs figures.
3. **Système visuel** : tokens, Instrument Serif + Montserrat, en-tête et pied de page, contrôles accessibles.
4. **Pages** : 10 routes, 26 pages statiques générées (6 axes de recherche, 4 fiches de publication).
5. **Interactions** : puzzle des outils (hero), Model Explorer (Observer → Explorer → Comprendre), séquence TIS, lâchers
   impulsionnels, démonstrateur individu-centré, explorateurs de compétences, de thèse et de code.
6. **Qualité** : tests, passe anti-slop (taste-skill), chaînes d'interface dans `src/i18n`, hooks qualité.

## Rapport QA (1er novembre 2026)
| Vérification | Résultat |
| --- | --- |
| `pnpm lint` | 0 erreur, 0 avertissement |
| `pnpm typecheck` | OK |
| `pnpm test` (Vitest) | 81/81 (dont l'intégrité de toutes les relations, la feuille du parcours, les citations BibTeX, la recherche, la saturation de l'aquarium et le sous-ensemble Zenodo de 269 estimations) : modèles reproduisant les figures des notebooks, intégrité des données, géométrie de la frise (aucun chevauchement), filtres de la pile d'outils et des publications |
| `pnpm test:e2e` (Playwright) | 88/88 (dont le courriel masqué avant clic, les redirections, les brouillons non publiés, la feuille au clavier, l'aquarium, la recherche et l'export BibTeX), dont 30 audits axe WCAG 2.2 AA sans violation (15 routes × desktop/mobile) ; sur desktop 1440 px et mobile 390 px : 15 routes en HTTP 200 avec un seul h1, sans débordement horizontal ni erreur console, avec métadonnées et lien canonique ; liens internes valides ; navigation ; filtres ; DOI et dépôts ; contrôles et réinitialisation du Model Explorer ; puzzle du hero (famille mise en évidence, pièce « Votre projet » vers le contact) ; mouvement réduit ; sitemap et robots |
| `pnpm build` | OK, 26 pages statiques |
| Hook `check-quality.sh` | OK (avertissements restants : longueur de certains composants de visualisation) |
| Inspection visuelle | captures à 1440 et 390 px de toutes les routes |

## Limites connues
- Les composants de visualisation dépassent la limite indicative de 25 lignes par fonction (avertissement du hook).
- Le domaine définitif est à renseigner dans `NEXT_PUBLIC_SITE_URL`.
- L'équipe d'encadrement provient du brief et doit être confirmée sur le manuscrit.
- Le démonstrateur individu-centré est une adaptation réduite : ses sorties ne sont pas comparables à l'article.
