import Image from "next/image";

const AVATARS = [
  { initial: "J", gradient: "linear-gradient(135deg,#3a3a3a,#141414)" },
  { initial: "M", gradient: "linear-gradient(135deg,#5a1a1a,#220a0a)" },
  { initial: "K", gradient: "linear-gradient(135deg,#1a3a5a,#0a1622)" },
  { initial: "T", gradient: "linear-gradient(135deg,#4a4a12,#1c1c08)" },
];

export default function Hero({ joined }: { joined: number }) {
  return (
    <header className="hero">
      <Image
        className="hero-bg"
        src="/hero.jpg"
        alt="Artist singing into a studio microphone in red light"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="wrap">
        <div className="hero-copy">
          <div className="eyebrow">Ikonic Early Access</div>
          <h1>
            Built
            <br />
            for
            <br />
            <span className="red">Artists.</span>
          </h1>
          <p className="hero-sub">
            Distribution. Publishing. Funding. Tools.
            <br />
            All in one place.
          </p>
          <div className="hero-cta-row">
            <a className="btn" href="#register">
              Join Early Access &nbsp;→
            </a>
          </div>
          <div className="social-proof">
            <div className="avatars">
              {/* DEV: replace initial-circles with real artist photos, or remove. */}
              {AVATARS.map((a) => (
                <div key={a.initial} className="avatar" style={{ background: a.gradient }}>
                  {a.initial}
                </div>
              ))}
            </div>
            <p>
              <strong>{joined.toLocaleString("en-US")} artists</strong> have already joined early
              access.
            </p>
          </div>
        </div>
      </div>
      <div className="script hero-script-corner">
        Artists
        <br />
        Own
        <br />
        More
        <br />
        <span className="underline">Here.</span>
      </div>
      <div className="hero-tag">
        A NEW STANDARD
        <br />
        FOR INDEPENDENT MUSIC.
      </div>
    </header>
  );
}
