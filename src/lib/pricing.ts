// TODO(pricing): every dollar amount and feature bullet below is a placeholder
// stand-in, not real pricing. Swap these for the actual plan numbers before
// this section ships — same rule as EARLY_ACCESS_JOINED in page.tsx: never
// ship a fake number as if it were real.

export type Audience = "artist" | "label";
export type Billing = "monthly" | "annual";

export type Plan = {
  id: "starter" | "growth" | "enterprise";
  name: string;
  tagline: string;
  monthly: number;
  annualMonthly: number;
  features: string[];
  overagePerArtist: number;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For your first release.",
    monthly: 9.99,
    annualMonthly: 8.33,
    features: [
      "Unlimited distribution",
      "Keep 100% of your rights",
      "1 artist profile",
      "Standard support",
    ],
    overagePerArtist: 6,
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For an active, growing catalog.",
    monthly: 19.99,
    annualMonthly: 16.66,
    features: [
      "Everything in Starter",
      "Publishing administration",
      "Playlist pitching tools",
      "Priority support",
    ],
    overagePerArtist: 5,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For labels and full-time careers.",
    monthly: 39.99,
    annualMonthly: 33.33,
    features: [
      "Everything in Growth",
      "Catalog funding & advances",
      "Dedicated account manager",
      "Early access to new tools",
    ],
    overagePerArtist: 4,
  },
];

export const AUDIENCE_COPY: Record<Audience, { eyebrow: string; title: string; sub: string }> = {
  artist: {
    eyebrow: "ARTIST PLANS",
    title: "Choose the plan that fits your journey.",
    sub: "All artist plans include global distribution and 100% ownership of your music.",
  },
  label: {
    eyebrow: "LABEL PLANS",
    title: "Choose the plan that fits your roster.",
    sub: "All label plans include global distribution and 100% ownership for every artist you manage.",
  },
};
