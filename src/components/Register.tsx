import CheckIcon from "@/components/CheckIcon";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import ProgressMeter from "@/components/ProgressMeter";

const BENEFITS = [
  "Early access to the platform",
  "Exclusive launch benefits",
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

        <EarlyAccessForm />
      </div>
    </section>
  );
}
