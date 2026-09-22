// Shared between the client form and the API route — keep this file free of
// server-only imports so it can be bundled into the client component.

export type AccountType = "artist" | "label" | "manager";

export const ACCOUNT_TYPES: AccountType[] = ["artist", "label", "manager"];

export const ACCOUNT_LABELS: Record<AccountType, string> = {
  artist: "Artist",
  label: "Label",
  manager: "Manager",
};

export const NAME_LABELS: Record<AccountType, string> = {
  artist: "Artist Name",
  label: "Label Name",
  manager: "Your Name",
};

export const NAME_PLACEHOLDERS: Record<AccountType, string> = {
  artist: "Your artist name",
  label: "Your label name",
  manager: "Your full name",
};

export const DISTRIBUTORS = [
  "IKONIC", "DistroKid", "TuneCore", "CD Baby", "UnitedMasters", "Stem",
  "Symphonic", "Too Lost", "Ditto", "AWAL", "ONErpm", "SoundOn",
  "Venice", "RouteNote", "Amuse", "Believe", "The Orchard", "Empire", "Other",
];

export const LISTENER_RANGES = [
  "Under 1K", "1K – 10K", "10K – 50K", "50K – 100K",
  "100K – 500K", "500K – 1M", "1M+",
];

export const GENRES = [
  "Hip-Hop", "R&B", "Pop", "Afrobeats", "Amapiano", "Drill",
  "Electronic", "Rock", "Country", "Jazz", "Gospel", "Latin", "Other",
];

export const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Nigeria", "Ghana",
  "South Africa", "Kenya", "Germany", "France", "Netherlands",
  "Australia", "Brazil", "Other",
];

export type EarlyAccessSubmission = {
  accountType: AccountType;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  spotify: string;
  distributor: string;
  listeners: string;
  genre: string;
  country: string;
};

export const EMPTY_SUBMISSION: EarlyAccessSubmission = {
  accountType: "artist",
  name: "",
  email: "",
  phone: "",
  instagram: "",
  spotify: "",
  distributor: "",
  listeners: "",
  genre: "",
  country: "",
};

// Deliberately permissive — enough to catch typos, not to police valid addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export type FieldErrors = Partial<Record<keyof EarlyAccessSubmission, string>>;

/** Step 1 is the low-friction lead capture: name + email only. */
export function validateStepOne(values: EarlyAccessSubmission): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please tell us what to call you.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(values.email)) errors.email = "That email doesn't look right.";
  return errors;
}

export function validateStepTwo(values: EarlyAccessSubmission): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.distributor) errors.distributor = "Select your current distributor.";
  if (values.spotify.trim() && !/^https?:\/\//i.test(values.spotify.trim())) {
    errors.spotify = "Include the full link (https://…).";
  }
  return errors;
}

/** Full check, run again on the server — never trust the client's word for it. */
export function validateSubmission(values: EarlyAccessSubmission): FieldErrors {
  return { ...validateStepOne(values), ...validateStepTwo(values) };
}

/** Single-field check for live (on-blur) validation, ahead of a full submit. */
export function validateField(
  field: keyof EarlyAccessSubmission,
  values: EarlyAccessSubmission,
): string | undefined {
  return { ...validateStepOne(values), ...validateStepTwo(values) }[field];
}

/** Coerces an unknown JSON body into the submission shape, trimming as it goes. */
export function normalizeSubmission(input: unknown): EarlyAccessSubmission {
  const raw = (input ?? {}) as Record<string, unknown>;
  const str = (key: keyof EarlyAccessSubmission) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim().slice(0, 300) : "";

  const accountType = ACCOUNT_TYPES.includes(raw.accountType as AccountType)
    ? (raw.accountType as AccountType)
    : "artist";

  return {
    accountType,
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    instagram: str("instagram"),
    spotify: str("spotify"),
    distributor: str("distributor"),
    listeners: str("listeners"),
    genre: str("genre"),
    country: str("country"),
  };
}
