import { notFound } from "next/navigation";

/**
 * Any URL that matches no page ends here, inside the [lang] layout, so the
 * localized not-found page renders with the site header and footer.
 */
export const instant = false;

export function generateStaticParams() {
  return [{ rest: ["introuvable"] }];
}

export default function CatchAll(): never {
  notFound();
}
