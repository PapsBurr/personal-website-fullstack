import RoundedImage from "./components/RoundedImage";
import NasaApod from "./components/NasaApod";

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

function ListItems(props: SkillItem) {
  return <li>{props.text}</li>;
}

export default function Home() {
  return (
    <>
      <div className="container-comp min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
        <main className="container-main">
          {/* Hero */}
          <section className="fade-trigger px-6 py-20 md:px-16 lg:px-24">
            <div className="max-w-4xl">
              <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">
                Creative Engineer
              </p>
              <h1 className="mt-4 text-5xl md:text-7xl font-extrabold leading-tight">
                Nathan Pons
                <span className="block text-fuchsia-400">
                  Software Engineer
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-300">
                I build bold, human‑centered software and visual experiences —
                blending art, aerospace curiosity, and full‑stack engineering.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-full bg-fuchsia-500 px-6 py-3 font-semibold text-black hover:bg-fuchsia-400">
                  View Projects
                </button>
                <button className="rounded-full border border-fuchsia-500 px-6 py-3 font-semibold text-fuchsia-300 hover:bg-fuchsia-900/40">
                  Contact
                </button>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="fade-trigger px-6 md:px-16 lg:px-24">
            <div className="max-w-3xl border-t border-fuchsia-900/40 pt-12">
              <h2 className="text-3xl font-bold text-fuchsia-300">About</h2>
              <p className="mt-4 text-slate-300">
                I’m a software engineer focused on clean systems and expressive
                interfaces. This site is a curated snapshot of my work, skills,
                and creative process.
              </p>
            </div>
          </section>

          {/* Spotlight Project */}
          <section className="fade-trigger px-6 py-16 md:px-16 lg:px-24">
            <div className="max-w-5xl rounded-2xl border border-fuchsia-900/40 bg-slate-950/60 p-6 md:p-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-fuchsia-300">
                  NASA APOD Spotlight
                </h2>
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
          <section className="fade-trigger px-6 md:px-16 lg:px-24">
            <h2 className="text-3xl font-bold text-fuchsia-300">
              Capabilities
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {skills.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-fuchsia-900/40 bg-slate-950/60 p-4 text-slate-200"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section className="fade-trigger px-6 py-16 md:px-16 lg:px-24">
            <h2 className="text-3xl font-bold text-fuchsia-300">
              Programming Languages
            </h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-3 text-slate-300">
              {pgrmLanguages.map((item) => (
                <li
                  key={item.key}
                  className="rounded-lg border border-fuchsia-900/40 bg-slate-950/60 p-3"
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </section>

          {/* Art Gallery */}
          <section className="fade-trigger px-6 md:px-16 lg:px-24">
            <h2 className="text-3xl font-bold text-fuchsia-300">Art</h2>
            <p className="mt-4 text-slate-300">
              Visual craft informs how I design interfaces — composition,
              rhythm, and focus all matter.
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-fuchsia-900/40 bg-slate-950/60 p-4">
                <h3 className="text-center text-slate-200">
                  Griffin, Digital, ~2021
                </h3>
                <div className="mt-4 flex justify-center">
                  <RoundedImage
                    src="/digital-griffin.jpg"
                    alt="An image of a digital painting of a portrait of a blue griffin."
                    width={500}
                    height={500}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-fuchsia-900/40 bg-slate-950/60 p-4">
                <h3 className="text-center text-slate-200">
                  Flower with Dew, Oil paint, ~2020
                </h3>
                <div className="mt-4 flex justify-center">
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
          <section className="fade-trigger px-6 py-16 md:px-16 lg:px-24">
            <h2 className="text-3xl font-bold text-fuchsia-300">Credentials</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-fuchsia-900/40 bg-slate-950/60 p-5">
                <h3 className="font-semibold text-slate-200">
                  Western Governors University
                </h3>
                <p className="text-slate-400">B.S. Software Engineering</p>
                <p className="text-slate-500">May, 2025</p>
              </div>
              <div className="rounded-xl border border-fuchsia-900/40 bg-slate-950/60 p-5">
                <h3 className="font-semibold text-slate-200">Certifications</h3>
                <ul className="mt-2 list-disc pl-6 text-slate-300">
                  <li>AWS Certified Cloud Practitioner</li>
                  <li>CompTIA Project +</li>
                  <li>Axelos ITIL Foundations</li>
                  <li>Coursera Google IT Support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="fade-trigger px-6 pb-20 md:px-16 lg:px-24">
            <div className="border-t border-fuchsia-900/40 pt-8 text-slate-400">
              <p>Let’s build something bold.</p>
              <p className="mt-2 text-sm">nathan@example.com</p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
