"use client";

import dynamic from "next/dynamic";

/** The Remotion player is client-only; the placeholder holds the film's frame so nothing shifts. */
export const CareerFilmEmbed = dynamic(() => import("./CareerFilmPlayer").then((m) => m.CareerFilmPlayer), {
  ssr: false,
  loading: () => <div className="aspect-[720/900] w-full bg-botanical md:aspect-[1280/600]" aria-hidden />,
});
