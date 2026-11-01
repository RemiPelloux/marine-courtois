# Design system

## Intention
Une revue scientifique devenue interactive : papier chaud, encre presque noire, un seul accent vermillon réservé aux
variables du modèle, aux actions et à l'état actif. La mise en scène vient de la composition, de l'échelle typographique
et des figures scientifiques, pas d'ornements.

## Couleurs (tokens Tailwind, `src/app/globals.css`)
| Token | Valeur | Usage |
| --- | --- | --- |
| `paper` | `#F5F2EB` | fond principal |
| `stone` | `#E8E5DD` | fond secondaire (changement de ton entre sections) |
| `ink` | `#171B18` | texte |
| `vermilion` | `#F04A2D` | accent : bouton principal (texte encre, contraste 4,7:1), courbes « stériles », état actif |
| `vermilion-deep` | `#C5361D` | accent en texte sur papier (4,8:1) |
| `vermilion-light` | `#FF6A4D` | accent en texte sur fond sombre (5,6:1) |
| `botanical` | `#19241F` | chapitres sombres |
| `muted` | `#686D67` | texte secondaire (#747973 assombri pour atteindre AA) |
| `rule` | `#CACCC4` | séparateurs (avec parcimonie) |

## Typographie
- **Instrument Serif** : titres, navigation, grands chiffres. L'italique vermillon est réservé à « Par le modèle. » (hero).
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
