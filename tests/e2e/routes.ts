import { localePath } from "../../src/i18n/paths";

/** Every page, by its internal (French) path; English URLs are derived from it. */
export const FR_ROUTES = [
  "/",
  "/parcours",
  "/recherche",
  "/recherche/fertilite-residuelle",
  "/publications",
  "/publications/reponse-fonctionnelle-invasivite",
  "/communications",
  "/vulgarisation",
  "/enseignement",
  "/projets",
  "/projets/modele-individu-centre",
  "/outils",
  "/these",
  "/laboratoire",
  "/contact",
];

export const EN_ROUTES = FR_ROUTES.map((r) => localePath("en", r));
export const ALL_ROUTES = [...FR_ROUTES, ...EN_ROUTES];
