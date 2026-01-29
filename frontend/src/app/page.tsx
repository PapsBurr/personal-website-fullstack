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
  { key: 6, text: "Puzzles/Problem Solving" },
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

// change this comment to cause github actions to run : 22

function ListItems(props: SkillItem) {
  return <li>{props.text}</li>;
}

export default function Home() {
  return (
    <>
      <div className="container-comp bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 min-h-screen">
        <div></div>
        <main className="flex-auto flex-col justify-between py-24 px-4 md:px-12 lg:px-24 bg-gray-100 text-black">
          {/* Intro Section */}
          <div className="fade-trigger">
            <h1 className="text-center">
              Nathan Pons <span className="block">Software Engineer</span>
            </h1>
            <hr></hr>
            <h2>About Me</h2>
            <p>
              Hi! My name is Nathan Pons and this is a website I made as a
              summary of my qualifications and projects I've made throughout the
              years and throughout my Software Engineering degree. On this
              website I go over some of those projects and talk about their
              features and the tools I used to create them. I hope you enjoy.
            </p>
            <hr></hr>
          </div>
          <div className="fade-trigger">
            <NasaApod />
          </div>

          {/* Qualifications Section */}
          <section className="fade-trigger">
            <h2>Qualifications</h2>
            <div className="fade-trigger">
              <h3>Western Governors University</h3>
              <div className="grid grid-cols-2">
                <p className="underline">B.S. Software Engineering</p>
                <p className="justify-end text-right">May, 2025</p>
              </div>
            </div>
            <div className="fade-trigger">
              <h3>Utah State Board of Education</h3>
              <div className="grid grid-cols-2">
                <p className="underline">GED - High school diploma</p>
                <p className="justify-end text-right">Dec, 2022</p>
              </div>
            </div>
            <div className="fade-trigger">
              <h3>Certifications</h3>
              <ul className="list-disc m-8 text-xl">
                <li data-testid="cert-item">
                  AWS Certified Cloud Practitioner
                </li>
                <li data-testid="cert-item">CompTIA Project +</li>
                <li data-testid="cert-item">Axelos ITIL Foundations</li>
                <li data-testid="cert-item">Coursera Google IT Support</li>
              </ul>
            </div>
            <div className="fade-trigger">
              <h3>Skills / Hobbies / Interests</h3>
              <ul className="list-disc m-8 text-xl" data-testid="skills-list">
                {skills.map((item) => (
                  <ListItems key={item.key} text={item.text} />
                ))}
              </ul>
            </div>
            <div className="fade-trigger">
              <h3>Programming Languages</h3>
              <ul
                className="list-disc m-8 text-xl"
                data-testid="programming-languages-list"
              >
                {pgrmLanguages.map((item) => (
                  <ListItems key={item.key} text={item.text} />
                ))}
              </ul>
            </div>
            <hr></hr>
          </section>

          {/* Art Section */}
          <section className="fade-trigger">
            <h2>Art</h2>
            <p>
              Art is something I've spent a lot of time doing and I feel it is
              deeply related to programming. Programming is all about creating a
              good experience for a user and meeting their needs, and art is one
              of the mediums to accomplish that. It especially shines through
              GUIs and guiding a user through an application. Understanding
              where a user is likely to search for something and, as a
              developer, being able to provide that thing for them where they
              want it.
            </p>
            <p>It's also something I enjoy, here are some of my favorites:</p>
            <h3 className="text-center">Griffin, Digital, ~2021</h3>
            <div className="flex gap-16 justify-center my-8">
              <RoundedImage
                src="/digital-griffin.jpg"
                alt="An image of a digital painting of a portrait of a blue griffin."
                width={500}
                height={500}
              />
            </div>
            <h3 className="text-center">Flower with Dew, Oil paint, ~2020</h3>
            <div className="flex gap-16 justify-center my-8">
              <RoundedImage
                src="/painting-flower.jpg"
                alt="An image of an oil painting of a orange flower with a few drops of dew on the petals."
                width={500}
                height={500}
              />
            </div>
            <hr></hr>
          </section>

          {/* This Site Section */}
          <section className="fade-trigger">
            <h2>This Site</h2>
            <h3>Tech Stack</h3>
            <p>
              Built with TypeScript using Next.JS, Express, HTML, Tailwind CSS,
              and Jest for testing. Hosted through AWS S3/Cloudfront and AWS
              Lambda.
            </p>
            <h3>Project Deployment and History</h3>
            <p>
              This project is set up for automatic deployment using GitHub
              Actions, so every time I commit and push changes to the
              repository, the code is tested and then deployed to the AWS cloud.
              <br />
              <br />
              Originally, the site was hosted on GitHub Pages, but I later
              migrated it to AWS S3 with CloudFront for better scalability and
              performance. I also added a containerized Express backend that
              fetches the NASA Astronomy Picture of the Day and provides it to
              the frontend via REST APIs. The backend is hosted through AWS
              Lambda and accessed with API Gateway. I'd like to host this site
              using Kubernetes as well but I won't due to extreme cloud costs.
            </p>
            <hr></hr>
          </section>
        </main>
      </div>
    </>
  );
}
