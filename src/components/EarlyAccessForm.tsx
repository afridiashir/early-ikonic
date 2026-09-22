"use client";

import { useRef, useState } from "react";

import CheckIcon from "@/components/CheckIcon";
import { SHOW_INSTAGRAM_POPUP_EVENT } from "@/components/InstagramPopup";
import {
  ACCOUNT_LABELS,
  ACCOUNT_TYPES,
  COUNTRIES,
  DISTRIBUTORS,
  EMPTY_SUBMISSION,
  GENRES,
  LISTENER_RANGES,
  NAME_LABELS,
  NAME_PLACEHOLDERS,
  validateField,
  validateStepOne,
  validateStepTwo,
  type AccountType,
  type EarlyAccessSubmission,
  type FieldErrors,
} from "@/lib/early-access";

// Fields rendered on step 1 — a server-side error keyed to one of these is
// invisible if the user has already moved on to step 2.
const STEP_ONE_FIELDS: (keyof EarlyAccessSubmission)[] = ["name", "email"];

type Status = "idle" | "submitting" | "success";

export default function EarlyAccessForm() {
  const [values, setValues] = useState<EarlyAccessSubmission>(EMPTY_SUBMISSION);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  // Bots fill hidden fields; humans never see this one.
  const honeypotRef = useRef<HTMLInputElement>(null);

  const set =
    (field: keyof EarlyAccessSubmission) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

  // Validates a single field the moment the user leaves it, so a bad value
  // is flagged live instead of waiting for the step's submit.
  const validateOnBlur =
    (field: keyof EarlyAccessSubmission) =>
    (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const message = validateField(field, { ...values, [field]: event.target.value });
      setErrors((prev) => ({ ...prev, [field]: message }));
    };

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const first = Object.keys(fieldErrors)[0];
    if (!first) return;
    // Deferred: a step switch triggered by this same error needs to render
    // first, or the target field won't exist in the DOM yet.
    setTimeout(() => document.getElementById(first)?.focus(), 0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (step === 1) {
      const stepErrors = validateStepOne(values);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length) {
        focusFirstError(stepErrors);
        return;
      }
      setStep(2);
      return;
    }

    const stepErrors = validateStepTwo(values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) {
      focusFirstError(stepErrors);
      return;
    }

    setFormError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypotRef.current?.value ?? "" }),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!res.ok) {
        if (payload.fieldErrors) {
          setErrors(payload.fieldErrors);
          // A step-1 field error is invisible on step 2's markup — jump back
          // so the error renders next to the field it belongs to.
          if (STEP_ONE_FIELDS.some((field) => payload.fieldErrors?.[field])) {
            setStep(1);
          }
          focusFirstError(payload.fieldErrors);
        }
        setFormError(payload.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      // Give them a moment to see the success message before asking for the follow.
      setTimeout(() => window.dispatchEvent(new Event(SHOW_INSTAGRAM_POPUP_EVENT)), 1500);
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
      setStatus("idle");
    }
  };

  const selectAccount = (type: AccountType) => {
    setValues((prev) => ({ ...prev, accountType: type }));
  };

  if (status === "success") {
    return (
      <div className="form-card">
        <div className="form-success" role="status">
          <CheckIcon />
          <h3>You&apos;re in.</h3>
          <p>
            Watch your inbox — your early access invite is on its way.
            <br />
            Welcome to the new standard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h3>Create Your Early Access Profile</h3>
      <p>Tell us a few details to get started.</p>

      <div className="acct-toggle" role="group" aria-label="Account type">
        {ACCOUNT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={values.accountType === type ? "active" : undefined}
            aria-pressed={values.accountType === type}
            onClick={() => selectAccount(type)}
          >
            {ACCOUNT_LABELS[type]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <input
          ref={honeypotRef}
          className="hp"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {step === 1 ? (
          <div className="form-step">
            <div className="step-hint">STEP 1 OF 2 — SECURE YOUR SPOT</div>

            <div className="field">
              <label htmlFor="name">
                {NAME_LABELS[values.accountType]} <span className="req">*</span>
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={NAME_PLACEHOLDERS[values.accountType]}
                value={values.name}
                onChange={set("name")}
                onBlur={validateOnBlur("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span className="err" id="name-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="email">
                Email <span className="req">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={set("email")}
                onBlur={validateOnBlur("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span className="err" id="email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <button className="btn" type="submit">
              Continue &nbsp;→
            </button>
            <p className="microcopy">Takes 10 seconds. Finish the rest on the next step.</p>
          </div>
        ) : (
          <div className="form-step">
            <div className="step-hint">STEP 2 OF 2 — TELL US ABOUT YOUR MUSIC</div>

            <div className="frow">
              <div className="field">
                <label htmlFor="phone">
                  Phone Number <span className="opt">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(201) 555-0123"
                  value={values.phone}
                  onChange={set("phone")}
                />
              </div>
              <div className="field">
                <label htmlFor="instagram">Instagram Handle</label>
                <input
                  id="instagram"
                  type="text"
                  placeholder="@yourhandle"
                  value={values.instagram}
                  onChange={set("instagram")}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="spotify">Spotify Link</label>
              <input
                id="spotify"
                type="url"
                placeholder="https://open.spotify.com/..."
                value={values.spotify}
                onChange={set("spotify")}
                onBlur={validateOnBlur("spotify")}
                aria-invalid={Boolean(errors.spotify)}
                aria-describedby={errors.spotify ? "spotify-error" : undefined}
              />
              {errors.spotify && (
                <span className="err" id="spotify-error">
                  {errors.spotify}
                </span>
              )}
            </div>

            <div className="frow">
              <div className="field">
                <label htmlFor="distributor">
                  Current Distributor <span className="req">*</span>
                </label>
                <select
                  id="distributor"
                  value={values.distributor}
                  onChange={set("distributor")}
                  onBlur={validateOnBlur("distributor")}
                  aria-invalid={Boolean(errors.distributor)}
                  aria-describedby={errors.distributor ? "distributor-error" : undefined}
                >
                  <option value="" disabled>
                    Select your distributor
                  </option>
                  {DISTRIBUTORS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                {errors.distributor && (
                  <span className="err" id="distributor-error">
                    {errors.distributor}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="listeners">Monthly Listeners</label>
                <select id="listeners" value={values.listeners} onChange={set("listeners")}>
                  <option value="" disabled>
                    Select range...
                  </option>
                  {LISTENER_RANGES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="frow">
              <div className="field">
                <label htmlFor="genre">Genre</label>
                <select id="genre" value={values.genre} onChange={set("genre")}>
                  <option value="" disabled>
                    Select genre...
                  </option>
                  {GENRES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="country">Country</label>
                <select id="country" value={values.country} onChange={set("country")}>
                  <option value="" disabled>
                    Select country...
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting…" : "Join Early Access  →"}
            </button>
            <button
              className="back-link"
              type="button"
              onClick={() => {
                setErrors({});
                setFormError(null);
                setStep(1);
              }}
            >
              ← Back
            </button>

            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}
            <p className="microcopy">No spam. Just real updates.</p>
          </div>
        )}
      </form>
    </div>
  );
}
