import RoundedImage from "./components/RoundedImage";
import NasaApod from "./components/NasaApod";
import Link from "next/link";

interface SkillItem {
  key: number;
  text: string;
}

const skills: SkillItem[] = [
  { key: 1, text: "Programming" },
  { key: 2, text: "Science" },
  { key: 3, text: "Learning" },
  { key: 4, text: "Art" },
  { key: 5, text: "Aerospace" },
  { key: 6, text: "Problem Solving" },
  { key: 7, text: "Strategy" },
];

const pgrmLanguages: SkillItem[] = [
  { key: 1, text: "Java" },
  { key: 2, text: "Python" },
  { key: 3, text: "JavaScript" },
  { key: 4, text: "TypeScript" },
  { key: 5, text: "MySQL" },
  { key: 6, text: "PostgeSQL" },
  { key: 7, text: "HTML" },
  { key: 8, text: "CSS" },
  { key: 9, text: "UML" },
];

export default function Home() {
  return (
    <>
      <div className="page-shell">
        <main className="page-main">
          {/* Hero */}
          <section className="fade-trigger">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-200/90">
                Software Engineer
              </p>
              <h1 className="mt-4 text-5xl md:text-7xl font-semibold leading-tight text-slate-100">
                Nathan Pons
              </h1>
              <p className="mt-6 text-lg text-slate-100">
                Blending art, aerospace, curiosity, and full‑stack engineering.
              </p>
              <div className="my-8 flex flex-wrap gap-4">
                <Link href="/projects" className="primary-button">
                  View Projects
                </Link>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="fade-trigger">
            <div className="max-w-3xl border-t border-slate-700/60 pt-12">
              <h2 className="">Overview</h2>
              <p className="text-slate-300">
                I’m a software engineer focused on secure, scalable, and
                maintainable systems with automation and security. This site is
                a snapshot of my work, skills, and creative process. Welcome to
                my learning journey that never ends.
              </p>
            </div>
          </section>

          {/* Spotlight Project */}
          <section className="fade-trigger">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between">
                <h2 className="">NASA APOD Spotlight</h2>
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  Live
                </span>
              </div>
              <div className="mt-6">
                <NasaApod />
              </div>
            </div>
          </section>

          {/* Capabilities */}
          <section className="fade-trigger">
            <h2 className="">Capabilities</h2>
            <ul
              className="mt-6 grid gap-4 md:grid-cols-3"
              data-testid="skills-list"
            >
              {skills.map((item) => (
                <li key={item.key} className="list-card">
                  {item.text}
                </li>
              ))}
            </ul>
          </section>

          {/* Languages */}
          <section className="fade-trigger border-t border-slate-700/60">
            <h2 className="">Programming Languages</h2>
            <ul
              className="mt-6 grid gap-3 md:grid-cols-3 text-slate-300"
              data-testid="programming-languages-list"
            >
              {pgrmLanguages.map((item) => (
                <li key={item.key} className="list-card">
                  {item.text}
                </li>
              ))}
            </ul>
          </section>

          {/* Art */}
          <section className="fade-trigger border-t border-slate-700/60">
            <h2 className="">Art</h2>
            <p className="text-slate-300">
              Art and programming both focus on creating great user experiences.
              Art helps guide users visually, especially in GUIs, making it
              easier for them to find what they need. As a developer,
              understanding this lets me design interfaces and experiences that
              feel intuitive and engaging.
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="card">
                <h3 className="text-center">Griffin, Digital, ~2021</h3>
                <div className="m-8 flex justify-center">
                  <RoundedImage
                    src="/digital-griffin.jpg"
                    alt="An image of a digital painting of a portrait of a blue griffin."
                    width={500}
                    height={500}
                  />
                </div>
              </div>
              <div className="card">
                <h3 className="text-center">
                  Flower with Dew, Oil paint, ~2020
                </h3>
                <div className="m-8 flex justify-center">
                  <RoundedImage
                    src="/painting-flower.jpg"
                    alt="An image of an oil painting of a orange flower with a few drops of dew on the petals."
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Credentials */}
          <section className="fade-trigger">
            <h2 className="">Credentials</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="card">
                <h3 className="">Western Governors University</h3>
                <p className="text-slate-400">B.S. Software Engineering</p>
                <p className="text-slate-500">May, 2025</p>
              </div>
              <div className="card">
                <h3 className="">Certifications</h3>
                <ul
                  className="mt-2 list-disc pl-6 text-slate-300"
                  data-testid="cert-list"
                >
                  <li>AWS Certified Cloud Practitioner</li>
                  <li>CompTIA Project +</li>
                  <li>Axelos ITIL Foundations</li>
                  <li>Coursera Google IT Support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="fade-trigger">
            <div className="border-t border-slate-700/60 pt-8 text-slate-400">
              <p>
                If you would like to get in touch, feel free to reach out via
                email.
              </p>
              <p className="mt-2 text-sm">npons393@gmail.com</p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
