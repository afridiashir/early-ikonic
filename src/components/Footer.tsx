import Image from "next/image";
import Link from "next/link";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ikonicdistro/?utm_source=site_footer",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-9.6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",
  },
  {
    label: "X",
    href: "#",
    path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.9L18.9 2zm-1.1 18.1h1.7L7.1 3.8H5.3l12.5 16.3z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.3 31.3 0 0024 12a31.3 31.3 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        <div>
          <Link className="f-logo" href="/" aria-label="IKONIC — Home">
            <Image src="/logo-white-crop.jpg" alt="IKONIC" width={1194} height={298} />
          </Link>
          <div className="f-copy">© {year} Ikonic. All rights reserved.</div>
        </div>
        <div className="f-links">
          {/* TODO: real Privacy / Terms / Contact destinations. */}
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
          <span className="f-social">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target={s.href !== "#" ? "_blank" : undefined}
                rel={s.href !== "#" ? "noopener noreferrer" : undefined}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
