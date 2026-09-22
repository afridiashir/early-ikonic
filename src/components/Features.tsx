const FEATURES = [
  {
    title: "DISTRIBUTE",
    copy: "Release your music everywhere.",
    icon: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  },
  {
    title: "PUBLISH",
    copy: "Keep more of what you create.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    title: "GET FUNDED",
    copy: "Get advances on the catalog you've already built.",
    icon: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
  },
  {
    title: "ARTIST TOOLS",
    copy: "Everything you need to grow.",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
];

export default function Features() {
  return (
    <section className="features">
      <div className="wrap" style={{ display: "contents" }}>
        {FEATURES.map((f) => (
          <div className="feature" key={f.title}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {f.icon}
            </svg>
            <h3>{f.title}</h3>
            <p>{f.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
