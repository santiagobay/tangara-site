import type { MockKind } from "./site";

/**
 * Website templates shown in the Work section. Each one is a complete, fictional demo site at
 * /templates/[slug]. Brands, addresses, prices and figures inside them are invented — the pages
 * say so in the Tangara bar at the top.
 */
export type Template = {
  slug: "restaurant" | "real-estate" | "store" | "construction";
  kind: MockKind;
  brand: string;
  industry: string;
  pitch: string;
  features: string[];
};

export const templates: Template[] = [
  {
    slug: "restaurant",
    kind: "mesa",
    brand: "Mesa",
    industry: "Restaurant",
    pitch: "A candlelit site where the menu sets the mood and a table is booked in three taps.",
    features: ["Live booking", "Menu with dish previews", "Mood that shifts as you scroll"],
  },
  {
    slug: "real-estate",
    kind: "casa",
    brand: "Casa Forma",
    industry: "Real estate · pre-sale",
    pitch: "Pre-sell homes that only exist as drawings: a model buyers can turn, live availability and plans that draw themselves.",
    features: ["Turnable 3D home", "Live unit availability", "Animated floor plan"],
  },
  {
    slug: "store",
    kind: "terra",
    brand: "Terra Supply",
    industry: "Online store",
    pitch: "A warm, tactile shop: products you can add without leaving the page and a cart that slides in.",
    features: ["Product grid", "Slide-in cart", "Scroll-driven brand story"],
  },
  {
    slug: "construction",
    kind: "iron",
    brand: "Ironline",
    industry: "Construction & renovation",
    pitch: "A builder's site with a building that assembles itself, before-and-after projects and an instant estimate.",
    features: ["3D build on load", "Before / after slider", "Quote estimator"],
  },
];

export const templateBySlug = (slug: string) => templates.find((t) => t.slug === slug);
