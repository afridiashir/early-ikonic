"use client";

import { useState } from "react";

import { AUDIENCE_COPY, PLANS, type Audience, type Billing } from "@/lib/pricing";

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(2));

export default function Pricing() {
  const [audience, setAudience] = useState<Audience>("artist");
  const [billing, setBilling] = useState<Billing>("monthly");

  const copy = AUDIENCE_COPY[audience];

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
      </div>

      <div id="cards" className="cards">
        {PLANS.map((plan) => {
          const price = billing === "monthly" ? plan.monthly : plan.annualMonthly;
          return (
            <div className="card" key={plan.id}>
              <h3>{plan.name}</h3>
              <p className="card-tagline">{plan.tagline}</p>
              <div className="card-price">
                <span className="amount">${fmt(price)}</span>
                <span className="period">/mo</span>
              </div>
              {billing === "annual" && <p className="card-billed">Billed annually</p>}
              <ul className="card-features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a className="btn" href="#register">
                Start Free Trial &nbsp;→
              </a>
            </div>
          );
        })}
      </div>

      {audience === "label" && (
        <div className="extra" id="extra">
          <b>Need more artist profiles?</b>
          {PLANS.map((plan) => (
            <span key={plan.id}>
              {plan.name} +${fmt(plan.overagePerArtist)} / artist
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
