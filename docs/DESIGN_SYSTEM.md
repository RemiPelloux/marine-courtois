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
- Échelle : `text-display` (hero), `text-headline` (titres de chapitre), `text-title`, texte de 16 à 18 px.

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
Motion pour les révélations de titres, les transitions d'onglets et l'indicateur de navigation. Le Living System et le
simulateur individu-centré utilisent `requestAnimationFrame` / `setInterval`, mis en pause hors écran via
IntersectionObserver. `prefers-reduced-motion` affiche immédiatement l'état final.

Couche « éditoriale cinématique » (anime.js, `useAnimeScope` qui ne s'exécute jamais en mouvement réduit) :

| Effet | Composant | Où |
| --- | --- | --- |
| Titres découpés en lignes qui montent hors d'un masque | `KineticTitle` (via `PageHeader`, `SectionHeading`) | toutes les pages |
| Phrase éclairée mot à mot au défilement | `ScrubText` | accueil (introduction), À propos |
| Défilement horizontal épinglé des six axes | `ResearchRail` (CSS `.rail*` dans `globals.css`) | accueil, Recherche ; liste verticale sur mobile |
| Figure de thèse qui suit le curseur | `HoverPreview` | listes de publications, pointeur fin uniquement |
| Bandes colorées qui s'ouvrent au défilement | `SectionFlow` | accueil |
| Transitions de page et titre qui se transforme de la liste à la fiche | `<ViewTransition>` de React (layout, `PageHeader morphName`) | navigation interne |

Sans JavaScript, les titres réapparaissent après 2,5 s (`kinetic-failsafe`) et le rail reste une liste verticale.
