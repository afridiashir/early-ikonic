import Closing from "@/components/Closing";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Platforms from "@/components/Platforms";
import Register from "@/components/Register";

// DEV: wire these to the live registration count before launch — do not ship a
// fake number. Overridable without a code change via .env.
const joined = Number(process.env.EARLY_ACCESS_JOINED || 2847);
const goal = Number(process.env.EARLY_ACCESS_GOAL || 5000);

export default function Home() {
  return (
    <>
      <Nav />
      <Hero joined={joined} />

      <section className="manifesto">
        <div className="wrap">
          <h2>
            More than <span className="red">distribution.</span>
          </h2>
          <p>
            Distributors put your music online. Ikonic builds the infrastructure underneath your
            entire career — so you own more, earn more, and go further.
          </p>
        </div>
      </section>

      <Features />
      <Register joined={joined} goal={goal} />
      <Platforms />
      <Closing />
      <Footer />
    </>
  );
}
