# Design system

## Intention
Une revue scientifique devenue interactive : papier sable, encre bleu nuit, un seul accent bleu Méditerranée réservé aux
variables du modèle, aux actions et à l'état actif. La mise en scène vient de la composition, de l'échelle typographique
et des figures scientifiques, pas d'ornements.

## Couleurs (tokens Tailwind, `src/app/globals.css`)
| Token | Valeur | Usage |
| --- | --- | --- |
| `paper` | `#F5F2EB` | fond principal (sable) |
| `stone` | `#E4EAEF` | fond secondaire, brume marine (changement de ton entre sections) |
| `ink` | `#0F1D2E` | texte, encre bleu nuit |
| `antibes` | `#0B2D4F` | chapitres sombres, bleu Antibes |
| `antibes-2` | `#123A63` | surface relevée, survol, ruban marin |
| `antibes-3` | `#1D4E80` | bleu azur profond (houle du ruban) |
| `azur` | `#8FC1EA` | séries secondaires des graphiques sur fond bleu |
| `accent` | `#2468B3` | accent bleu Méditerranée : bouton principal (texte blanc, 5,1:1), courbes « stériles », état actif |
| `accent-deep` | `#1D5A9E` | accent en texte sur sable et brume (≥ 5,8:1) |
| `accent-light` | `#6FB3F2` | accent sur bleu Antibes (≥ 5,2:1, y compris sur `antibes-2`) ; les graphiques basculent via `--viz-accent` |
| `muted` | `#55626F` | texte secondaire, ardoise (≥ 5,1:1 sur sable et brume) |
| `mist` | `#A8BFD6` | texte secondaire sur bleu (7,4:1) |
| `rule` | `#C5CED6` | séparateurs (avec parcimonie) |

Le **ruban marin** en haut du pied de page (`SeaRibbon`) est un clin d'œil discret à Antibes : deux houles lentes en bleu
Antibes (la Méditerranée, et les oscillations des modèles) et les coordonnées de la vieille ville, sans la nommer.

## Typographie
- **Instrument Serif** : titres, navigation, grands chiffres. L'italique bleu est réservé à « Par le modèle. » (hero).
- **Montserrat** : texte, interface, légendes et métadonnées (chiffres tabulaires).
- **IBM Plex Mono** : uniquement les blocs de code de l'explorateur de code.
- Échelle : `text-display` (hero), `text-headline` (titres de chapitre), `text-title`, puis `text-subhead` (32), `text-card` (28), `text-2xl` (24) pour les titres serif ; `text-body` (17), `text-base` (16), `text-note` (15), `text-sm` (14), `text-meta` (13), `text-xs` (12) pour le texte. Pas de taille arbitraire en rem dans les composants (les px des figures SVG sont des unités de viewBox).

## Règles « anti-slop » appliquées (taste-skill)
- Pas de micro-libellés en capitales espacées : les libellés sont en casse de phrase, à taille lisible.
- Pas de monospace hors code.
- Pas de dégradés, de verre, d'ombres au repos ni de croix ou arcs décoratifs.
- Pas de pastilles bordées : les étiquettes sont des aplats de ton.
- Pas de numérotation décorative. Seul l'index en quatre parties du hero, issu de la maquette de référence, est conservé.
- Accent stylé limité à une seule occurrence (hero).
- Texte courant en encre pleine.

## Mise en page
Largeur maximale de 1360 px (`max-w-site`), gouttière `clamp(1rem, 3.2vw, 2.5rem)`, grille de 12 colonnes,
alternance de chapitres clairs et sombres. Mobile reconstruit : hero empilé, légende du graphique au-dessus,
annotations réduites à leurs points, contrôles en pleine largeur.

## Mouvement
Motion pour les révélations de titres, les transitions d'onglets et l'indicateur de navigation. Le puzzle du hero
(`src/app/puzzle.css`) est en CSS pur : les pièces arrivent famille par famille depuis l'extérieur du plateau
(sortie exponentielle), la jointure s'éclaire à l'emboîtement, les quatre axes ferment la croix, puis la pièce
« Votre projet » se dessine. Il démarre à l'entrée dans l'écran (usePlayOnce). Le
simulateur individu-centré utilisent `requestAnimationFrame` / `setInterval`, mis en pause hors écran via
IntersectionObserver. `prefers-reduced-motion` affiche immédiatement l'état final.

Couche « éditoriale cinématique » (anime.js, `useAnimeScope` qui ne s'exécute jamais en mouvement réduit) :

| Effet | Composant | Où |
| --- | --- | --- |
| Titres découpés en lignes qui montent hors d'un masque | `KineticTitle` (via `PageHeader`, `SectionHeading`) | toutes les pages |
| Phrase éclairée mot à mot au défilement | `ScrubText` | accueil (introduction), À propos |
| Défilement horizontal épinglé des six axes | `ResearchRail` (CSS `.rail*` dans `globals.css`) | accueil, Recherche ; liste verticale sur mobile |
| Bandes colorées qui s'ouvrent au défilement | `SectionFlow` | accueil |
| Transitions de page et titre qui se transforme de la liste à la fiche | `<ViewTransition>` de React (layout, `PageHeader morphName`) | navigation interne |

Sous deux publications, une animation ou un jeu : l'aquarium complet (`FishPanel` : densité de proies, captures par banc, liens vers l'article) sous l'article sur la réponse fonctionnelle, et la chasse au mâle sauvage (`FlyHunt`, `src/app/fly-hunt.css`) sous la thèse, aussi simple que la diapositive de soutenance. Le joueur est une femelle qui cherche l'unique mâle sauvage (pull rayé rouge et blanc, bonnet) parmi les mâles stériles lâchés, en pull rose comme le marquage des stériles. Les deux mouches sont le dessin de la soutenance (`public/figures/fly`) : l'original pour le sauvage, le même dessin en rose et sans bonnet pour les stériles. Trois tailles de lâcher (1 sauvage pour 20, 80 puis 200 stériles, mouches de plus en plus petites), une vignette « À trouver » dans le coin, un chronomètre et un compte d'erreurs. Les mouches se dandinent une fois à l'entrée dans l'écran puis au survol ; mouvement réduit : tout reste immobile.

Sans JavaScript, les titres réapparaissent après 2,5 s (`kinetic-failsafe`) et le rail reste une liste verticale.
