import CheckIcon from "@/components/CheckIcon";
import ProgressMeter from "@/components/ProgressMeter";
import PromoCode from "@/components/PromoCode";

const BENEFITS = [
  "7-day free trial on every plan",
  "20% off your first 12 months, monthly or annual",
  "Priority account approval",
  "Be the first to new features",
  "Help shape the future",
];

export default function Register({ joined, goal }: { joined: number; goal: number }) {
  return (
    <section className="register" id="register">
      <div className="wrap register-grid">
        <div>
          <div className="eyebrow">Be the first</div>
          <h2>
            Claim your <span className="red">spot.</span>
          </h2>
          <p className="lede">
            Get early access to Ikonic and be the first to experience a new standard for
            independent music.
          </p>
          <ul className="benefits">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <CheckIcon />
                {benefit}
              </li>
            ))}
          </ul>
          <ProgressMeter joined={joined} goal={goal} />
        </div>

        <div className="form-card">
          <h3>Use code EarlyIkon26</h3>
          <p>Applied automatically when you start your trial — 20% off your first 12 months.</p>
          <PromoCode code="EarlyIkon26" />
          <a className="btn" href="#pricing">
            View Plans &amp; Start Trial &nbsp;→
          </a>
          <p className="microcopy">7-day free trial. Cancel anytime.</p>
        </div>
      </div>
    </section>
  );
}
