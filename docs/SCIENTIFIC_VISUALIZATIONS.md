# Visualisations scientifiques

Tous les modèles se trouvent dans `src/lib/scientific/` et sont testés dans `tests/unit/models.test.ts`.

## Intégrateur
`rk4.ts` : Runge-Kutta d'ordre 4 à pas fixe (les notebooks utilisent `odeint`). Pas de 0,1 jour (fertilité résiduelle)
et de 0,05 jour (ré-accouplement, raide au début). Les densités sont bornées à 0.

## 1. Fertilité résiduelle — `residual-fertility.ts`
Source : `thesisData/Chapter 3 - Residual Fertility/Script_Manuscrit_SIT_RF.ipynb`, fonction `modele_SIT`.
```
dS = −μS·S + (1−δ)σ
dF = −μF·F + r(1−ρ)·(M+εηS)/(k+M+ηS)·1/(1+βF)·F
dM = −μM·M + rρ·(M+εηS)/(k+M+ηS)·1/(1+βF)·F + δσ
```
μF=0,050 · μM=0,036 · μS=0,057 · ρ=0,5 · β=0,24 · r=23,7 · k=1 · η=0,2 · état initial [0, 983, 983].
**Vérification** : à t = 300 j, σ=500 → F≈18 (sans fertilité résiduelle), ≈175 (δ=1 %), ≈47 (ε=1 %) ; σ=5000 → ≈74 (δ=1 %),
≈6 (ε=1 %). Ces valeurs correspondent à la figure des dynamiques temporelles du notebook.
Usage : Model Explorer (onglet 1), Module 2 étape 5, figure « F(300) selon σ et δ ».

## 2. Ré-accouplement — `remating.ts`
Source : `thesisData/Chapter 4 - Multiple Mating/Compartmental_model_output_vAvril.ipynb` (cellule 10).
Variables L, M, F_I, F_F, S ; τF=0,12, τI=0,14 (« Last ») ou τ=0 (« First ») ; μL=0,037, μF=0,012, μM=0,013,
μS=0,054, η=0,6, ω=6, K=36 000, ν=0,08, p=0,5. États initiaux « forte » [30 000, 100 000, 0, 100 000, 0] et
« faible » [100, 300, 0, 300, 0].
**Vérification** : panneaux A et B de la figure First/Last (par ex. σ=450 000 : First → 0 vers 3 000 j, Last → ≈22 700).

## 3. Modèle discret — `knipling.ts`
Source : `fig_chapter2_thesis.ipynb`, cellule « Cobweb diagram » : F(t+1) = λF²/(F+S), équilibres 0 et S/(λ−1).

## 4. Branches d'équilibre — `MethodVisuals.tsx`
Source : même notebook, « Bifurcation diagram — Model with Competition and SIT » : S(F) avec r=6, p=0,5, μF=μM=0,5, β=0,01.

## 5. Lâchers impulsionnels — `ImpulsiveReleases.tsx`
Source : `Notebook_part_impulsive_releases.ipynb`, solution périodique M_S(t) = σθ·e^{−μS(t mod θ)}/(1−e^{−μSθ}), μS=0,054.

## 6. Démonstrateur individu-centré — `abm.ts`
Adaptation de `sit_remating_abm/script_ABM_batchrun.py` (Mesa), avec effectifs ×1/50 et lâchers quotidiens. Règles
conservées et simplifications listées en tête de fichier et sur la page `/laboratoire`. Démonstrateur seulement.

## Accessibilité des graphiques
Chaque SVG porte un résumé textuel qui se met à jour (`<title>` ou `aria-label`) avec les valeurs calculées. Tous les
contrôles sont des `<input type="range">` étiquetés avec une sortie `<output>`, et les onglets suivent le motif ARIA
(flèches, Origine et Fin).
