/**
 * Founders shown on /team. Fill these in when the real info is ready — everything marked
 * "coming soon" is placeholder copy. Leave a link empty ("") to hide it.
 *
 * `plate` picks the interactive tile drawn for each founder:
 *  - "terminal": a terminal that types the bio
 *  - "dots":     the initials drawn in particles that react to the pointer
 *  - "scramble": the name and role decode from random letters
 */
export type Founder = {
  n: string;
  name: string;
  initials: string;
  role: string;
  focus: string[];
  bio: string;
  /** Path under /public, e.g. "/team/santiago.jpg". Empty = monogram. */
  photo: string;
  links: { linkedin: string; instagram: string; email: string };
  plate: "terminal" | "dots" | "scramble";
};

const PLACEHOLDER_BIO =
  "Bio coming soon: what they do at Tangara, what they've built and what they care about in a project.";

export const founders: Founder[] = [
  {
    n: "01",
    name: "Santiago Bayona",
    initials: "SB",
    role: "Co-founder · Software engineer",
    focus: ["Focus coming soon"],
    bio: PLACEHOLDER_BIO,
    photo: "",
    links: { linkedin: "", instagram: "", email: "" },
    plate: "terminal",
  },
  {
    n: "02",
    name: "Sebastian Velasquez",
    initials: "SV",
    role: "Co-founder · Role coming soon",
    focus: ["Focus coming soon"],
    bio: PLACEHOLDER_BIO,
    photo: "",
    links: { linkedin: "", instagram: "", email: "" },
    plate: "dots",
  },
  {
    n: "03",
    name: "Sebastian Sanabria",
    initials: "SS",
    role: "Co-founder · Role coming soon",
    focus: ["Focus coming soon"],
    bio: PLACEHOLDER_BIO,
    photo: "",
    links: { linkedin: "", instagram: "", email: "" },
    plate: "scramble",
  },
];
