import RoundedImage from "./components/RoundedImage";
import NasaApod from "./components/NasaApod";

const skills = [
  { id: 1, text: "Programming"},
  { id: 2, text: "Science"},
  { id: 3, text: "Learning"},
  { id: 4, text: "Art"},
  { id: 5, text: "Aerospace"},
  { id: 6, text: "Puzzles/Problem Solving"},
  { id: 7, text: "Strategy"}
]

const pgrmLanguages = [
  { id: 1, text: "Java"},
  { id: 2, text: "Python"},
  { id: 3, text: "JavaScript"},
  { id: 4, text: "TypeScript"},
  { id: 5, text: "MySQL"},
  { id: 6, text: "PostgeSQL"},
  { id: 7, text: "HTML"},
  { id: 8, text: "CSS"},
  { id: 9, text: "UML"},
]

// change this comment to cause github actions to run : 10

function ListItems(props) {
  return <li>{props.text}</li>
}

export default function Home() {

  return (
    <>
      <div className="container-comp bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 min-h-screen">
        <div></div>
        <main className="flex-auto flex-col justify-between py-24 px-4 md:px-12 lg:px-24 bg-gray-100 text-black">
          
          {/* Intro Section */}
          <div className="fade-trigger">
            <h1 className="text-center">Nathan Pons <span className="block">Software Engineer</span></h1>
            <hr></hr>
            <h2>About Me</h2>
            <p>
              Hi! My name is Nathan Pons and this is a website I made as a
              summary of my qualifications and projects I've made throughout the
              years and throughout my Software Engineering degree. On this website
              I go over some of those projects and talk about their features and the 
              tools I used to create them. I hope you enjoy. 
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
                <li data-testid="cert-item">AWS Certified Cloud Practitioner</li>
                <li data-testid="cert-item">CompTIA Project +</li>
                <li data-testid="cert-item">Axelos ITIL Foundations</li>
                <li data-testid="cert-item">Coursera Google IT Support</li>
              </ul>
            </div>
            <div className="fade-trigger">  
              <h3>Skills / Hobbies / Interests</h3>
              <ul className="list-disc m-8 text-xl" data-testid="skills-list">
                {skills.map((item) => (
                  <ListItems key={item.id} text={item.text} />
                ))}
              </ul>
            </div>
            <div className="fade-trigger">
              <h3>Programming Languages</h3>
              <ul className="list-disc m-8 text-xl" data-testid="programming-languages-list">
                {pgrmLanguages.map((item) => (
                  <ListItems key={item.id} text={item.text} />
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
            <p>
              It's also something I enjoy, here are some of my favorites:
            </p>
            <h3 className="text-center">
              Griffin, Digital, ~2021
            </h3>
            <div className="flex gap-16 justify-center my-8">
              <RoundedImage
                src="/digital-griffin.jpg"
                alt="An image of a digital painting of a portrait of a blue griffin."
                width={500}
                height={500}
              />
            </div>
            <h3 className="text-center">
              Flower with Dew, Oil paint, ~2020
            </h3>
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
            <p>
              Built with JavaScript using Next.JS, Express, HTML, Tailwind CSS, and Jest. It 
              automatically deploys the website using GitHub Actions whenever 
              I commit and push to the repository. 
              Since it's release, I've swapped it from being deployed through GitHub Pages to instead
              being hosted through AWS S3 + CloudFront after being turned into a docker image. 
              I've also added an Express backend to serve the NASA 
              Astronomy Picture of the Day to the frontend through an API endpoint. The backend is also hosted 
              through AWS using Lambda and API Gateway. Eventually, I'd like to host it through Kubernetes as 
              well but I'm worried about the costs associated with using AWS EKS.
            </p>
            <hr></hr>
          </section>
        </main>
      </div>
    </>
  );
}
