import Image from "next/image";

export default function Closing() {
  return (
    <section className="closing">
      <Image
        src="/crowd.webp"
        alt="Concert crowd with hands raised in red light"
        fill
        sizes="100vw"
      />
      <div className="wrap">
        <div className="closing-copy">
          <div className="eyebrow">Built for what&apos;s next</div>
          <h2>
            Same artists.
            <br />
            <span className="red">A bigger future.</span>
          </h2>
          <p>
            Ikonic is more than distribution. We&apos;re building the infrastructure for
            independent artists to own more, earn more, and go further.
          </p>
          <a className="btn" href="#register">
            Join Early Access &nbsp;→
          </a>
        </div>
      </div>
      <div className="script closing-script">
        Independent
        <br />
        goes further
        <br />
        here.
      </div>
    </section>
  );
}
