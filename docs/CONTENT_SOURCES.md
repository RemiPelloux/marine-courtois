# Provenance des contenus

Vérification effectuée le 1er novembre 2026. Identifiants de sources : `src/data/sources.ts`.

## 1. Faits vérifiés
| Affirmation | Source |
| --- | --- |
| Doctorat, Université Côte d'Azur, soutenance le 27/11/2025 | ORCID (thèse, DOI 10.70675/d019d560z1de7z4d84za3e2ze5ba4cf3718f) · rapport Inria MACBES 2025 · theses.fr s352892 |
| Titre de la thèse | README de gitlab.com/marinecourtois/thesisData · theses.fr |
| Équipe d'encadrement | brief fourni par le commanditaire (à confirmer sur le manuscrit) |
| Structure en 6 chapitres (Introduction, Modeling SIT, Residual Fertility, Multiple Mating, Agricultural Context, Discussion) | README de thesisData + dossiers du dépôt |
| Article BMB 2025 : titre, auteurs, revue, 87(2):25, DOI | Crossref |
| Article PLOS Comput Biol 2026 : titre, auteurs, 22(4):e1014212, CC BY 4.0 | Crossref |
| Article J Anim Ecol 2026 : titre, auteurs, 95(5):808–823, CC BY 4.0, contribution égale | Crossref + brief |
| Préprint bioRxiv 10.1101/2025.07.26.666957 | ORCID |
| Jeu de données Zenodo 10.5281/zenodo.18377688 | DataCite |
| 8 communications et posters (titres, événements, lieux, dates, co-auteurs) | API HAL (identifiants hal-…) |
| Outils logiciels (Python, Jupyter, NumPy, SciPy, SymPy, pandas, statsmodels, Matplotlib, seaborn, Mesa, python-control) et versions | imports et commentaires des notebooks et de script_ABM_batchrun.py |
| Outils déclarés hors code publié : R, R Shiny, MySQL, Power BI (`src/data/toolkit.ts`) | indiqués par le commanditaire le 1/11/2026 ; absents des dépôts publics, donc affichés à part (cercle vide), sans preuve ni projet associé |
| Film « Parcours » (Remotion) et frise animée de la page À propos | générés à partir des mêmes données vérifiées (`src/data/milestones.ts`) : communications HAL, articles Crossref, soutenance theses.fr |
| Manuscrit et diapositives de soutenance en PDF | fichiers présents dans thesisData (`Thesis - Manuscript/`, `Defense - Slides/`) |
| Paramètres du modèle individu-centré (durées de vie, η = 0,59, périodes réfractaires, ponte, capacité) | script_ABM_batchrun.py (références bibliographiques citées dans le code) |
| Courriel marine.courtois@inrae.fr, ORCID, GitLab | brief + profils publics |

## 2. Explications éditoriales
Les résumés, questions, mécanismes et « en termes simples » reformulent les sources ci-dessus sans aller au-delà
(fichiers `src/data/research.ts`, `thesis.ts`, `publications.ts`). Aucun chiffre de résultat n'y est ajouté, à
l'exception des comptes de l'étude J Anim Ecol (269 observations, 45 espèces) fournis dans le brief.

## 3. Modèles et visualisations illustratifs
- **Living System (hero)** : courbes calculées avec le modèle de fertilité résiduelle (paramètres du notebook). Le nuage
  de points est un rendu illustratif, ce que la page indique explicitement.
- **Model Explorer** : systèmes transcrits des notebooks et vérifiés (voir `SCIENTIFIC_VISUALIZATIONS.md`). Chaque
  panneau rappelle que l'exploration ne remplace pas les analyses publiées.
- **Démonstrateur individu-centré** : adaptation réduite et simplifiée, signalée comme telle.
- **Schéma TIS (étapes 1 à 4)** : schéma pédagogique.

## 4. Fonctionnalités proposées, non implémentées
Version anglaise, formulaire de contact, synchronisation ORCID/HAL, planche illustrée de *D. suzukii*.

## Ce que le site ne contient pas, volontairement
Pas de poste actuel, de prix, de financement, de nombre de citations, d'équation décorative, de seuil numérique inventé
ni de compétence auto-évaluée.

## Figures
`public/figures/*.webp` : sorties PNG des notebooks publics de thesisData, converties en WebP. Chaque figure est créditée
avec le nom de son notebook (`src/data/code.ts`).
