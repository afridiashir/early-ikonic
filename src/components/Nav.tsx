import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <div className="wrap">
        <Link className="logo" href="/" aria-label="IKONIC — Home">
          <Image src="/logo-white-crop.jpg" alt="IKONIC" width={1194} height={298} priority />
        </Link>
        <div className="nav-cta">
          {/* TODO: point at the real sign-in once the app is live. */}
          <a className="signin" href="#register">
            Sign In
          </a>
          <a className="btn nav-btn" href="#register">
            Join Early Access &nbsp;→
          </a>
        </div>
      </div>
    </nav>
  );
}
