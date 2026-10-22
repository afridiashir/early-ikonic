// Sourced from the approved IKONIC_Early_Access_LINKED_UI_HTML handoff
// (index.html / styles.css / app.js, Oct 18 2026 link manifest).

export type Audience = "artist" | "label";
export type Billing = "monthly" | "annual";

export type Plan = {
  id: string;
  name: string;
  desc: string;
  regular: number;
  /** Shown above `features` as "Everything in X plus:" — omitted on the entry tier. */
  inherit?: string;
  features: string[];
  /** Label plans only — cost per artist profile beyond the plan's included count. */
  overagePerArtist?: number;
  /** Middle tier of each audience — gets the "Most Popular" ribbon. */
  popular?: boolean;
  signupUrl: string;
};

export const ARTIST_PLANS: Plan[] = [
  {
    id: "basic",
    name: "BASIC",
    desc: "Release your music professionally.",
    regular: 4.99,
    features: [
      "Global music distribution (200+ countries)*",
      "Keep 100% ownership",
      "Basic analytics",
      "ISRC / UPC generation",
      "Artist Bio Link",
      "Show calendar",
      "Smart links",
      "Release management",
      "Standard support",
    ],
    signupUrl: "https://ikonic.flicknexs.com/register?plan=basic&promo=EarlyIkon26",
  },
  {
    id: "pro",
    name: "PRO",
    desc: "Take control of your music business.",
    regular: 9.99,
    inherit: "Everything in Basic plus:",
    features: [
      "Publishing administration (collect worldwide)",
      "Advanced analytics",
      "Royalty splits",
      "Team members (up to 3)",
      "Priority support",
    ],
    popular: true,
    signupUrl: "https://ikonic.flicknexs.com/register?plan=pro&promo=EarlyIkon26",
  },
  {
    id: "pro-plus",
    name: "PRO+",
    desc: "Build and scale with your team.",
    regular: 19.99,
    inherit: "Everything in Pro plus:",
    features: [
      "Advance eligibility",
      "Catalog valuation access",
      "Custom payment splits",
      "Team members (up to 6)",
      "Playlist pitching",
      "Fast track review",
      "Early access to new tools",
    ],
    signupUrl: "https://ikonic.flicknexs.com/register?plan=pro_plus&promo=EarlyIkon26",
  },
];

export const LABEL_PLANS: Plan[] = [
  {
    id: "starter",
    name: "STARTER",
    desc: "Run your label from day one.",
    regular: 39,
    features: [
      "Up to 5 artist profiles",
      "5 team members",
      "Global distribution (200+ countries)*",
      "Basic roster analytics",
      "Royalty splits",
      "ISRC / UPC generation",
      "Artist Bio Link",
      "Show calendar",
      "Standard support",
    ],
    overagePerArtist: 6,
    signupUrl: "https://ikonic.flicknexs.com/register?plan=label_starter&promo=EarlyIkon26",
  },
  {
    id: "growth",
    name: "GROWTH",
    desc: "Scale your roster with confidence.",
    regular: 99,
    inherit: "Everything in Starter plus:",
    features: [
      "15 artist profiles",
      "10 team members",
      "Publishing administration (collect worldwide)",
      "Advanced roster analytics",
      "Bulk upload tools",
      "Scheduled releases",
      "Priority support",
    ],
    overagePerArtist: 5,
    popular: true,
    signupUrl: "https://ikonic.flicknexs.com/register?plan=label_growth&promo=EarlyIkon26",
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    desc: "Built for established labels.",
    regular: 249,
    inherit: "Everything in Growth plus:",
    features: [
      "50 artist profiles",
      "15 team members",
      "Advance eligibility",
      "Catalog valuation access",
      "Custom payment splits",
      "Playlist pitching",
      "Fast track review",
      "Dedicated account manager",
      "API access (by request)",
    ],
    overagePerArtist: 4,
    signupUrl: "https://ikonic.flicknexs.com/register?plan=label_enterprise&promo=EarlyIkon26",
  },
];

export const PLANS_BY_AUDIENCE: Record<Audience, Plan[]> = {
  artist: ARTIST_PLANS,
  label: LABEL_PLANS,
};

export const AUDIENCE_COPY: Record<Audience, { eyebrow: string; title: string; sub: string }> = {
  artist: {
    eyebrow: "ARTIST PLANS",
    title: "Choose the plan that fits your journey.",
    sub: "All artist plans include global distribution and 100% ownership of your music.",
  },
  label: {
    eyebrow: "LABEL PLANS",
    title: "Scale your label. Build your legacy.",
    sub: "Manage multiple artists, streamline operations, and grow your label with powerful tools.",
  },
};

export type PriceBlock = {
  /** Full, undiscounted amount — the monthly rate, or regular*12 for annual. */
  original: number;
  /** EarlyIkon26 price: 20% off, on both monthly and annual billing. */
  discounted: number;
  interval: "/month" | "/year";
};

/** EarlyIkon26 takes 20% off the first 12 months — 12 monthly payments, or the first annual one. */
export function priceFor(plan: Plan, billing: Billing): PriceBlock {
  const original = billing === "monthly" ? plan.regular : plan.regular * 12;
  const discounted = Math.round(original * 0.8 * 100) / 100;
  return { original, discounted, interval: billing === "monthly" ? "/month" : "/year" };
}
