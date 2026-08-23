/**
 * Footer.jsx
 *
 * Site-wide footer containing four sections: brand information with
 * social media links, quick navigation links, resource links (About,
 * Privacy, Terms, Contact) and the project tech stack. Ends with a
 * bottom bar showing copyright and tagline.
 */

import { NavLink } from "react-router-dom";
import logo from "../../assets/Criclyst_LOGO.png";

import {
  FaGithub,
  FaLinkedin,
  FaXTwitter
} from "react-icons/fa6";

import {
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
} from "react-icons/si";

/**
 * Renders the application footer.
 * @returns {JSX.Element} The footer element.
 */
function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Criclyst Logo"
              className="h-14 w-14 object-contain"
            />

            <h2 className="text-4xl font-bold text-white">
              Criclyst
            </h2>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            AI-powered Cricket Analytics Platform built for
            cricket enthusiasts to explore player statistics,
            match insights and performance analytics.
          </p>

          <p className="mt-4 font-medium text-cyan-400">
            Beyond Statistics.
          </p>
          <p className="mt-2 text-xs text-slate-500">Version 1.0</p>

          <div className="mt-6 flex items-center gap-5 text-2xl text-slate-400">

            <a
              href="https://github.com/royalknight71/criclyst"
              target="_blank"
              rel="noreferrer"
              className="transition duration-300 hover:scale-110 hover:text-cyan-400"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/krish-gupta-1441b2311/"
              target="_blank"
              rel="noreferrer"
              className="transition duration-300 hover:scale-110 hover:text-cyan-400"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              className="transition duration-300 hover:scale-110 hover:text-cyan-400"
            >
              <FaXTwitter />
            </a>

          </div>
        </div>

        {/* Quick Links */}

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-3">

            <li>
              <NavLink
                to="/"
                className="text-slate-400 transition duration-300 hover:translate-x-1 hover:text-cyan-400"
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/players"
                className="text-slate-400 transition duration-300 hover:translate-x-1 hover:text-cyan-400"
              >
                Players
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/teams"
                className="text-slate-400 transition duration-300 hover:translate-x-1 hover:text-cyan-400"
              >
                Teams
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/matches"
                className="text-slate-400 transition duration-300 hover:translate-x-1 hover:text-cyan-400"
              >
                Matches
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/analytics"
                className="text-slate-400 transition duration-300 hover:translate-x-1 hover:text-cyan-400"
              >
                Analytics
              </NavLink>
            </li>

          </ul>
        </div>

        {/* Resources */}

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Resources
          </h3>

          <ul className="space-y-3 text-slate-400">

            <li className="transition duration-300 hover:translate-x-1 hover:text-cyan-400 cursor-pointer">
              About
            </li>

            <li className="transition duration-300 hover:translate-x-1 hover:text-cyan-400 cursor-pointer">
              Privacy Policy
            </li>

            <li className="transition duration-300 hover:translate-x-1 hover:text-cyan-400 cursor-pointer">
              Terms of Service
            </li>

            <li className="transition duration-300 hover:translate-x-1 hover:text-cyan-400 cursor-pointer">
              Contact
            </li>

          </ul>
        </div>

        {/* Tech Stack */}

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Tech Stack
          </h3>

<ul className="space-y-4">

  <li className="flex items-center gap-3 text-slate-400 transition duration-300 hover:text-cyan-400">
    <SiReact className="text-sky-400 text-xl" />
    <span>React</span>
  </li>

  <li className="flex items-center gap-3 text-slate-400 transition duration-300 hover:text-cyan-400">
    <SiTailwindcss className="text-cyan-400 text-xl" />
    <span>Tailwind CSS</span>
  </li>

  <li className="flex items-center gap-3 text-slate-400 transition duration-300 hover:text-cyan-400">
    <SiNodedotjs className="text-green-500 text-xl" />
    <span>Node.js</span>
  </li>

  <li className="flex items-center gap-3 text-slate-400 transition duration-300 hover:text-cyan-400">
    <SiExpress className="text-white text-xl" />
    <span>Express.js</span>
  </li>

  <li className="flex items-center gap-3 text-slate-400 transition duration-300 hover:text-cyan-400">
    <SiMongodb className="text-green-600 text-xl" />
    <span>MongoDB</span>
  </li>

</ul>
        </div>

      </div>

      {/* Bottom Footer */}

      <div className="border-t border-slate-800 ">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row py-7">

          <p>
            © 2026 Criclyst. All rights reserved.
          </p>

          <p>
            Turning Cricket Data into Insights.
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;