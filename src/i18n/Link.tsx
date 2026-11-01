"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLang } from "@/i18n/client";
import { localePath } from "@/i18n/paths";

/** next/link that takes internal French paths and links to the page in the current language. */
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const lang = useLang();
  return <NextLink href={typeof href === "string" ? localePath(lang, href) : href} {...rest} />;
}
