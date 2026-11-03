"use client";

import type { ReactNode } from "react";
import { FishPanel } from "@/components/fish/FishPanel";
import { FlyHunt } from "@/components/fly-hunt/FlyHunt";

/** An animation or a game that belongs to one publication, shown under its row. */
const MEDIA: Record<string, () => ReactNode> = {
  "pub-2026-functional-response": () => <FishPanel />,
  "these-2025": () => <FlyHunt />,
};

export function RowMedia({ id }: { id: string }) {
  const media = MEDIA[id];
  return media ? <div className="min-w-0 md:col-span-8 md:col-start-3">{media()}</div> : null;
}
