import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import "./Hero.css";

const headlinePhrases = [
  "Understand every innings.",
  "Track every moment.",
  "Discover player insights.",
  "Compare cricket legends.",
  "Explore the game deeper.",
];

const descriptions = [
  "Live match coverage and real-time score updates.",
  "Upcoming fixtures so you never miss a match.",
  "Recent results and match-winning performances.",
  "Detailed player profiles and team insights.",
  "Compare players and explore cricket analytics.",
];

function Hero() {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [typedText, setTypedText] = useState("");
  const [descriptionIndex, setDescriptionIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event) => setReducedMotion(event.matches);

    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;

    let timeoutId;
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const phrase = headlinePhrases[phraseIndex];
      if (!deleting) {
        characterIndex += 1;
        setTypedText(phrase.slice(0, characterIndex));

        if (characterIndex === phrase.length) {
          deleting = true;
          timeoutId = window.setTimeout(tick, 1650);
          return;
        }

        timeoutId = window.setTimeout(tick, 76);
        return;
      }

      characterIndex -= 1;
      setTypedText(phrase.slice(0, characterIndex));

      if (characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % headlinePhrases.length;
        timeoutId = window.setTimeout(tick, 420);
        return;
      }

      timeoutId = window.setTimeout(tick, 34);
    };

    timeoutId = window.setTimeout(tick, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setDescriptionIndex((index) => (index + 1) % descriptions.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [reducedMotion]);

  return (
    <section className="bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#172840] px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 md:pb-20 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400 sm:text-sm sm:tracking-[0.3em]">Criclyst · Cricket, in context</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">
            <span className="block">Follow the game.</span>
            <span className="hero-typewriter block" aria-hidden="true">
              <span className="hero-typewriter__sizer">{headlinePhrases[0]}</span>
              <span className="hero-typewriter__text">
                {reducedMotion ? headlinePhrases[0] : typedText}
                {!reducedMotion && <span className="hero-typewriter__cursor" />}
              </span>
            </span>
            <span className="sr-only">Follow the game. Understand every innings.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8" aria-hidden="true">
            <span key={reducedMotion ? "reduced" : descriptionIndex} className="hero-description">
              {reducedMotion ? descriptions[0] : descriptions[descriptionIndex]}
            </span>
          </p>
          <p className="sr-only">
            Criclyst covers live matches, upcoming fixtures, recent results, player profiles, team insights, player comparisons, and cricket analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
            <NavLink
              to="/matches"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 sm:px-6 sm:text-base"
            >
              Browse Matches <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </NavLink>
            <NavLink
              to="/players"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300 sm:px-6 sm:text-base"
            >
              Explore Players
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
