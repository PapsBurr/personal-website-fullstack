import RoundedImage from "../components/RoundedImage";

export default function Page() {
  return (
    <>
      <div className="container-comp bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 min-h-screen">
        <div></div>
        <main className="flex-auto flex-col justify-between py-24 px-4 md:px-12 lg:px-24 bg-gray-100 text-black">
          {/* Opening Section */}
          <section className="fade-trigger">
            <h1>DevOps</h1>
            <p>
              These are some of the projects I've worked on to learn about
              DevOps and it's best practices.
            </p>
            <hr></hr>
          </section>

          {/* Github Actions Section */}
          <section className="fade-trigger">
            <h2>GitHub Actions</h2>
            <p>
              GitHub Actions is a CI/CD tool that helps automate software
              workflows. It was my introduction to CI/CD, and where I first
              built a deployment pipeline from scratch.
            </p>
            <p>
              I use GitHub Actions here to automatically run tests and deploy my
              projects whenever I push changes to the main branch. This website
              itself is deployed through GitHub Actions.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow.jpg"
                alt="GitHub Actions Workflow"
                width={1000}
              />
            </div>
            <p>
              The workflow YAML file contains several steps, some of which I'm
              still learning about what they do and why they are there. It
              should be said that I didn't write this alone, having a lot of
              help from articles on the internet.
            </p>
            <p>
              At the top of the YAML file, the <strong>name</strong> tag sets
              the workflow's name, which appears in the GitHub Actions tab of
              the repository.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow-tabs.png"
                alt="GitHub Actions Workflow Tabs"
                width={300}
              />
            </div>
            <p>
              The <strong>on</strong> tag specifies the events that trigger the
              workflow. In this case, the workflow runs whenever there is a push
              to the main branch. Permissions are for GitHub actions to be able
              to actually read the repo and perform actions on it securely.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow-jobs.jpg"
                alt="GitHub Actions Workflow Jobs Section"
                width={1000}
              />
            </div>
            <p>
              The <strong>Jobs</strong> section is where the actual heavy
              lifting of the script is done. It defines that it is to be built
              in a ubuntu environment. Checkout loads the repo's contents into
              the runner for Actions to actually work with. The next section is
              large and verbose but all it does is detect the package manager
              and stores related variables for later. Afterwards the runner will
              install Node version 20 and enables caching for later deployments
              so it doesn't have to install everytime. If there is a cache the
              next section will find it and restore it for use.
            </p>
            <p>
              Before the site can be built, tests must be run. This section has
              saved me a couple of times from having broken deployments.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow-tests.jpg"
                alt="GitHub Actions Workflow Tests Section"
                width={800}
              />
            </div>
            <p>
              Finally the artifact is built to the out directory, uploaded, and
              then deployed to the GitHub Pages environment with the url I
              supplied in the GitHub Pages tab.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow-deployment.jpg"
                alt="GitHub Actions Workflow Deployment Section"
                width={600}
              />
            </div>
            <hr />
          </section>

          {/* Docker Section */}
          <section className="fade-trigger">
            <h2>Docker</h2>
            <p>
              Docker is a containerization platform allowing developers to
              create a consistent environment for their applications. This means
              that applications can run the same way regardless of where they
              are deployed, whether it's on a developer's local machine, a
              testing server, or in production. It removes the common problem of
              the code working on one machine but not another due to differences
              in configurations, dependencies, or operating systems.
            </p>
            <h3>This web application</h3>
            <p>
              This project utilizes Docker to ensure consistent environments
              across development, testing, and production. I have containerized
              the backend to allow it to run in an isolated environment,
              ensuring that all dependencies and configurations are included
              within the container. This allows for a scalable application that
              can easily be expanded to meet demand.
            </p>
            <p>
              This is accomplished through the use of a Dockerfile. It is a
              short yet powerful script that dictates how a Docker image will be
              built.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/website-dockerfile.png"
                alt="Dockerfile used for this website"
                width={400}
              />
            </div>
            <p>
              The Dockerfile begins with AWS's Node.js image for Lambda as a
              base image, which is optimized for serverless applications. It
              then installs the dependencies and copies the application code
              into the image. Finally, it runs the command to start the
              application.
            </p>
            <h3>Docker with Kubernetes in Explore California</h3>
            <p>
              This project was based on the LinkedIn Learning course&nbsp;
              <a
                href="https://www.linkedin.com/learning/kubernetes-your-first-project-24688192"
                target="_blank"
                className="underline text-blue-600 italic"
              >
                Kubernetes: Your first project
              </a>
              &nbsp;by Carlos Nunez.
            </p>
            <p>
              In this project, I containerized a sample web application using
              Docker. The application is a simple website that displays
              information about California's national parks.
            </p>
            <p>
              Docker was used in this project in a manner similar to the
              previous project. However, I used a different application. Instead
              of Docker Desktop, I used Podman to build and manage the
              containers since it has an easier time integrating with
              Kubernetes. Because of this, the Dockerfile had to be slightly
              modified to work with Podman, such as renaming it to
              "Containerfile" and ensuring that any Docker-specific instructions
              were compatible with Podman's requirements.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/explore-california-containerfile.png"
                alt="Containerfile used for the Explore California project"
                width={600}
              />
            </div>
            <p>
              The image builds off of the existing nginx:alpine image, which is
              a lightweight version of the Nginx web server. It then copies the
              static files for the website into the appropriate directory for
              Nginx to serve. The server is then hosted on port 80.
            </p>
            <p>
              There is much more to be said about this project and I will save
              that for the Kubernetes section below.
            </p>
            <hr></hr>
          </section>

          {/* Kubernetes Section */}
          <section className="fade-trigger">
            <h2>Kubernetes</h2>
            <p>I will add my exprience with AWS here soon.</p>
            <hr></hr>
          </section>

          {/* AWS Section */}
          <section className="fade-trigger">
            <h2>AWS</h2>
            <p>I will add my exprience with AWS here soon.</p>
            <hr></hr>
          </section>
        </main>
      </div>
    </>
  );
}
