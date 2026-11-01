import { PlayPauseReset, SegmentedControl, Slider } from "@/components/interactions/Controls";
import { SIGMA_MAX, type Mode, type TooltipKind } from "./model";

const TOOLTIP_TEXT: Record<TooltipKind, string> = {
  wild: "Densité de femelles sauvages F, rapportée à sa valeur initiale. Elle diminue car une part croissante des accouplements implique des mâles stériles.",
  sterile:
    "Densité de mâles stériles S, rapportée à la densité atteinte avec l'intensité de lâchers maximale de cette visualisation. Elle se stabilise lorsque lâchers et mortalité s'équilibrent.",
  fan: "Faisceau gris : trajectoires des femelles sauvages pour d'autres intensités de lâchers (10 % à 100 %).",
};

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: "observer", label: "Observer" },
  { value: "comparer", label: "Comparer" },
];

export function Legend({ mode }: { mode: Mode }) {
  return (
    <div className="pointer-events-none mb-3 sm:absolute sm:top-0 sm:right-1 sm:z-10 sm:mb-0 sm:rounded-[3px] sm:border sm:border-rule sm:bg-paper/90 sm:px-4 sm:py-3">
      <ul className="label flex flex-wrap gap-x-5 gap-y-2 text-xs sm:block sm:space-y-2 sm:text-xs">
        <li className="flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-ink" aria-hidden /> Femelles sauvages
        </li>
        <li className="flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-accent" aria-hidden /> Mâles stériles
        </li>
        {mode === "comparer" && (
          <li className="flex items-center gap-3">
            <span className="w-4 border-t-2 border-dashed border-ink" aria-hidden /> Avec 1 % de mâles fertiles
          </li>
        )}
      </ul>
    </div>
  );
}

export function ChartTooltip({ kind }: { kind: TooltipKind }) {
  return (
    <div role="status" className="absolute bottom-[14%] left-[9%] z-20 max-w-xs rounded-[3px] border border-ink bg-paper p-3 text-xs leading-relaxed shadow-[4px_4px_0_0_rgba(15,29,46,0.12)]">
      {TOOLTIP_TEXT[kind]}
    </div>
  );
}

export interface ChartControlsProps {
  playing: boolean;
  onToggle: () => void;
  onReplay: () => void;
  share: number;
  onShare: (share: number) => void;
  mode: Mode;
  onMode: (mode: Mode) => void;
}

export function ChartControls({ playing, onToggle, onReplay, share, onShare, mode, onMode }: ChartControlsProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 rounded-[4px] border border-rule bg-paper/80 p-3 sm:flex-row sm:items-center sm:gap-5 sm:p-3.5">
      <PlayPauseReset playing={playing} onToggle={onToggle} onReset={onReplay} />
      <span className="hidden h-8 w-px bg-rule sm:block" aria-hidden />
      <Slider
        className="flex-1"
        label="Lâchers stériles"
        symbol="σ"
        value={share}
        min={0}
        max={100}
        step={5}
        onChange={onShare}
        format={(v) => `${v} %`}
      />
      <SegmentedControl label="Mode d'affichage" value={mode} onChange={onMode} options={MODE_OPTIONS} />
    </div>
  );
}

export function Caption() {
  return (
    <figcaption className="mt-4 grid gap-1 border-t border-rule pt-3">
      <p className="label text-center text-ink/80">
        Visualisation pédagogique — données illustratives
      </p>
      <p className="mono-meta mx-auto max-w-[72ch] text-center text-xs text-muted">
        Courbes : modèle de fertilité résiduelle (Courtois et al., 2025), paramètres du notebook public · σ<sub>max</sub> ={" "}
        {SIGMA_MAX} ind./jour · le nuage de points est un rendu illustratif, pas des observations.
      </p>
    </figcaption>
  );
}
