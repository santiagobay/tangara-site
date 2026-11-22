import type { MockKind } from "./site";

/**
 * Direction studies with their own page (/work/[slug]). These are fictional brands made by
 * Tangara to show how we'd approach a project — never present them as client work, and never add
 * results or metrics to them.
 */
export type Study = {
  slug: string;
  kind: MockKind;
  name: string;
  sector: string;
  tagline: string;
  brief: string;
  idea: string;
  decisions: { t: string; d: string }[];
  palette: { name: string; hex: string; ink?: boolean }[];
  type: { display: string; text: string; sample: string };
  signature: { title: string; d: string };
  success: string;
  services: string[];
  /** Page theme taken from the study's own palette. */
  theme: { bg: string; fg: string; accent: string; muted: string };
};

export const studies: Study[] = [
  {
    slug: "casa-forma",
    kind: "casa",
    name: "Casa Forma",
    sector: "Real estate",
    tagline: "A more human home",
    brief:
      "A boutique developer is pre-selling twelve townhomes. Buyers have to fall for homes that, for now, only exist as drawings.",
    idea:
      "Sell the life, not the floor plan. Renders lit at golden hour, a model buyers can turn in their hands, and listings that read like a neighbour giving a tour.",
    decisions: [
      { t: "Terracotta and pine", d: "The warmth of clay roofs against deep forest green. Calm enough for a big decision, warm enough to feel like home." },
      { t: "A house you can turn", d: "Every unit type gets a 3D model that rotates under the pointer, so buyers understand the light and the layout before the visit." },
      { t: "Listings that answer first", d: "Price range, size and availability up front, the questions buyers ask before anything else." },
      { t: "One clear next step", d: "Every page ends with the same action: book a visit. Never a vague contact form." },
    ],
    palette: [
      { name: "Terracotta", hex: "#bd573a" },
      { name: "Pine", hex: "#1b5143" },
      { name: "Clay", hex: "#f2ebd8", ink: true },
      { name: "Sand", hex: "#e7c9a0", ink: true },
      { name: "Night", hex: "#1e201f" },
    ],
    type: { display: "Bricolage Grotesque", text: "Instrument Serif", sample: "Home, before it exists" },
    signature: {
      title: "The turnable house",
      d: "Move your pointer across the model. On a phone, drag it. This is the kind of 3D we'd build for each unit type.",
    },
    success: "Buyers who arrive at the sales office already knowing which unit they want.",
    services: ["Real estate & development", "3D & motion", "Websites"],
    theme: { bg: "#1b5143", fg: "#f2ebd8", accent: "#e7c9a0", muted: "rgba(242, 235, 216, 0.72)" },
  },
  {
    slug: "mesa",
    kind: "mesa",
    name: "Mesa",
    sector: "Restaurant",
    tagline: "Tonight, a table for two",
    brief:
      "A neighbourhood restaurant takes bookings by phone. When nobody picks up during service, the table goes to someone else.",
    idea:
      "Make booking part of the evening. The menu sets the mood, and a reservation takes three taps from any phone, on any street corner.",
    decisions: [
      { t: "Candlelight palette", d: "Near-black and warm amber, the colour of the room after seven. Readable outside at night, never harsh." },
      { t: "Three-tap booking", d: "Date, time, guests. No account, no pop-ups, nothing between the guest and the table." },
      { t: "A menu for small screens", d: "Dishes grouped the way people order, with prices aligned and allergens a tap away." },
      { t: "A confirmation that welcomes", d: "The booking ends with a note from the kitchen, not a ticket number." },
    ],
    palette: [
      { name: "Night", hex: "#15110e" },
      { name: "Amber", hex: "#f6c98b", ink: true },
      { name: "Cream", hex: "#f4ece0", ink: true },
      { name: "Ember", hex: "#c9744a" },
      { name: "Smoke", hex: "#3a332d" },
    ],
    type: { display: "Bricolage Grotesque", text: "Instrument Serif", sample: "A table for two" },
    signature: {
      title: "The three-tap reservation",
      d: "Pick a time and confirm. It's the actual interaction we'd ship, down to the feedback at each step.",
    },
    success: "Fewer missed calls, fuller weeknights, and a site the staff are proud to share.",
    services: ["Websites", "Brand identity", "Marketing & growth"],
    theme: { bg: "#15110e", fg: "#f4ece0", accent: "#f6c98b", muted: "rgba(244, 236, 224, 0.7)" },
  },
  {
    slug: "terra-supply",
    kind: "terra",
    name: "Terra Supply",
    sector: "Food & retail",
    tagline: "Good things grow",
    brief:
      "A small-batch pantry brand sells at farmers' markets and wants an online store that feels as warm as its stall.",
    idea:
      "Treat the site like a market table: tactile product shots, honest origin stories, and a checkout that never makes you hunt for the button.",
    decisions: [
      { t: "Colour from the soil", d: "Deep moss green with a sharp citrus yellow reserved for prices and the add-to-cart button." },
      { t: "Type with a handshake", d: "A bold grotesk for products and a friendly serif for the stories behind them." },
      { t: "Product first", d: "Every card shows origin, weight and price at a glance. Add to cart without leaving the page." },
      { t: "Motion that ripens", d: "Produce drifts in slowly as you scroll. Nothing blinks, nothing shouts." },
    ],
    palette: [
      { name: "Moss", hex: "#193d35" },
      { name: "Citrus", hex: "#e4ff62", ink: true },
      { name: "Leaf", hex: "#5aa371" },
      { name: "Linen", hex: "#f2ebd8", ink: true },
      { name: "Mint", hex: "#3eb9a8" },
    ],
    type: { display: "Bricolage Grotesque", text: "Instrument Serif", sample: "Grown slowly, sold kindly" },
    signature: {
      title: "The product card",
      d: "Add a jar to the cart and watch the count update. Small feedback, done properly, is what makes a store feel trustworthy.",
    },
    success: "A store regulars can reorder from in under a minute, and a brand first-time visitors remember.",
    services: ["Brand identity", "Websites", "Marketing & growth"],
    theme: { bg: "#193d35", fg: "#f2ebd8", accent: "#e4ff62", muted: "rgba(242, 235, 216, 0.72)" },
  },
];

export const studyBySlug = (slug: string) => studies.find((s) => s.slug === slug);
