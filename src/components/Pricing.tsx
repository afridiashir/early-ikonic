"use client";

import { useState } from "react";

import {
  AUDIENCE_COPY,
  PLANS_BY_AUDIENCE,
  priceFor,
  type Audience,
  type Billing,
} from "@/lib/pricing";

// Same wordmarks as the old standalone Platforms section — now a trust strip
// on the pricing header instead of its own section.
const DSPS = [
  {
    name: "Spotify",
    path: "M12 0a12 12 0 100 24 12 12 0 000-24zm5.5 17.3a.7.7 0 01-1 .3c-2.6-1.6-5.9-2-9.8-1.1a.7.7 0 01-.3-1.4c4.2-1 7.8-.6 10.7 1.2.4.2.5.7.4 1zm1.5-3.3a.9.9 0 01-1.2.3c-3-1.9-7.6-2.4-11.2-1.3a.9.9 0 01-.5-1.7c4.1-1.2 9.1-.6 12.6 1.5.4.2.5.8.3 1.2zm.1-3.4C15.2 8.2 8.9 8 5.4 9.1a1.1 1.1 0 01-.6-2c4-1.2 11-1 15.4 1.7a1.1 1.1 0 01-1.1 1.8z",
  },
  {
    name: "Apple Music",
    path: "M17.05 12.54c0-2.4 1.96-3.55 2.05-3.6-1.12-1.64-2.86-1.86-3.48-1.89-1.48-.15-2.89.87-3.64.87-.75 0-1.9-.85-3.13-.83-1.61.02-3.1.94-3.93 2.38-1.68 2.9-.43 7.2 1.2 9.56.8 1.15 1.75 2.45 3 2.4 1.2-.05 1.66-.78 3.12-.78s1.87.78 3.14.75c1.3-.02 2.12-1.17 2.91-2.33.92-1.34 1.3-2.64 1.32-2.7-.03-.02-2.54-.98-2.56-3.83zM14.16 4.06c.66-.8 1.1-1.9 1.1-3.06-1.06.04-2.35.71-3.11 1.6-.68.79-1.28 2.05-1.12 3.26 1.19.09 2.4-.6 3.13-1.8z",
  },
  {
    name: "YouTube",
    path: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.3 31.3 0 0024 12a31.3 31.3 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
  {
    name: "TikTok",
    path: "M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 11-2.59-2.59c.27 0 .53.04.78.12V9.77a5.76 5.76 0 00-.78-.05 5.66 5.66 0 105.66 5.66V9.01a7.35 7.35 0 004.3 1.38V7.3a4.28 4.28 0 01-3.22-1.48z",
  },
];

const money = (n: number) => `$${n.toFixed(2)}`;

export default function Pricing() {
  const [audience, setAudience] = useState<Audience>("artist");
  const [billing, setBilling] = useState<Billing>("monthly");

  const copy = AUDIENCE_COPY[audience];
  const plans = PLANS_BY_AUDIENCE[audience];

  return (
    <section id="pricing" className="wrap section">
      <div className="pricing-head">
        <div>
          <p className="eyebrow" id="typeTitle">
            {copy.eyebrow}
          </p>
          <h2 id="pricingTitle">{copy.title}</h2>
          <p className="muted" id="pricingSub">
            {copy.sub}
          </p>
        </div>
      </div>

      <div className="switches">
        <div className="switch" id="audience" role="group" aria-label="Audience">
          <button
            className={audience === "artist" ? "active" : undefined}
            aria-pressed={audience === "artist"}
            onClick={() => setAudience("artist")}
          >
            Artists
          </button>
          <button
            className={audience === "label" ? "active" : undefined}
            aria-pressed={audience === "label"}
            onClick={() => setAudience("label")}
          >
            Labels
          </button>
        </div>
        <div className="switch" id="billing" role="group" aria-label="Billing cycle">
          <button
            className={billing === "monthly" ? "active" : undefined}
            aria-pressed={billing === "monthly"}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            className={billing === "annual" ? "active" : undefined}
            aria-pressed={billing === "annual"}
            onClick={() => setBilling("annual")}
          >
            Annual
          </button>
        </div>
        {billing === "monthly" && <span className="pill">20% OFF MONTHLY (12 months)</span>}
      </div>

      <div id="cards" className="cards">
        {plans.map((plan) => {
          const { original, discounted, interval } = priceFor(plan, billing);
          return (
            <article className={`card${plan.popular ? " popular" : ""}`} key={plan.id}>
              {plan.popular && <div className="popular-tag">MOST POPULAR</div>}
              <h3>{plan.name}</h3>
              <p className="desc">{plan.desc}</p>

              {billing === "monthly" ? (
                <>
                  <div className="old">{money(original)}</div>
                  <div className="price">
                    {money(discounted)} <small>{interval}</small>
                  </div>
                  <span className="discount">20% OFF for first 12 paid months</span>
                </>
              ) : (
                <>
                  <div className="price">
                    {money(original)} <small>{interval}</small>
                  </div>
                  <span className="annual-note">
                    Annual plan — no EarlyIkon26 discount currently
                  </span>
                </>
              )}

              {plan.inherit && (
                <div className="inherit">
                  <span>✓</span>
                  {plan.inherit}
                </div>
              )}

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <a
                className="btn signup"
                href={plan.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start 7 Day Free Trial &nbsp;→
              </a>
            </article>
          );
        })}
      </div>

      {audience === "label" && (
        <div className="extra" id="extra">
          <b>Need more artist profiles?</b>
          {plans.map((plan) => (
            <span key={plan.id}>
              {plan.name.charAt(0) + plan.name.slice(1).toLowerCase()} +$
              {(plan.overagePerArtist ?? 0).toFixed(0)} / artist
            </span>
          ))}
        </div>
      )}

      <p className="fine">
        Payment card required. Your plan begins billing after the 7-day trial unless canceled.
        The 20% discount applies to the first 12 paid monthly billing periods only; annual plans
        are not discounted by EarlyIkon26. Standard pricing resumes afterward. Cancel anytime;
        cancellation ends promotional eligibility. *Verify 200+ country coverage and all features
        before publication.
      </p>
    </section>
  );
}
