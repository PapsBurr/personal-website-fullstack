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
              GitHub Actions is a CI/CD tool that helps automate software workflows. It was my introduction to CI/CD, and where I first built a deployment pipeline from scratch.
            </p>
            <p>
              I use GitHub Actions here to automatically run tests and deploy my projects whenever I push changes to the main branch. This website itself is deployed through GitHub Actions.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow.jpg"
                alt="GitHub Actions Workflow"
                width={1000}
              />
            </div>
            <p>
              The workflow YAML file contains several steps, some of which I'm still learning about what they do and why they are there. 
              It should be said that I didn't write this alone, having a lot of help from articles on the internet.
            </p>
            <p>
              At the top of the YAML file, the <strong>name</strong> tag sets the workflow's name, which appears in the GitHub Actions tab of the repository.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow-tabs.png"
                alt="GitHub Actions Workflow Tabs"
                width={300}
              />
            </div>
            <p>
              The <strong>on</strong> tag specifies the events that trigger the workflow. In this case, the workflow runs whenever there is a push to the main branch.
              Permissions are for GitHub actions to be able to actually read the repo and perform actions on it securely.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow-jobs.jpg"
                alt="GitHub Actions Workflow Jobs Section"
                width={1000}
              />
            </div>
            <p>
              The <strong>Jobs</strong> section is where the actual heavy lifting of the script is done. It defines that it is to be built in a ubuntu environment. Checkout loads the repo's contents
              into the runner for Actions to actually work with. The next section is large and verbose but all it does is detect the package manager and stores related variables for later.
              Afterwards the runner will install Node version 20 and enables caching for later deployments so it doesn't have to install everytime.
              If there is a cache the next section will find it and restore it for use.
            </p>
            <p>
              Before the site can be built, tests must be run. This section has saved me a couple of times from having broken deployments.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/github-actions-workflow-tests.jpg"
                alt="GitHub Actions Workflow Tests Section"
                width={800}
              />
            </div>
            <p>
              Finally the artifact is built to the out directory, uploaded, and then deployed to the GitHub Pages environment with the url I supplied in the GitHub Pages tab.
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
              I will add my exprience with Docker here soon.
            </p>
            <hr></hr>
          </section>

          {/* Kubernetes Section */}
          <section className="fade-trigger">
            <h2>Kubernetes</h2>
            <p>
              I will add my exprience with Kubernetes here soon.
            </p>
            <hr></hr>
          </section>

          {/* AWS Section */}
          <section className="fade-trigger">
            <h2>AWS</h2>
            <p>
              I will add my exprience with AWS here soon.
            </p>
            <hr></hr>
          </section>

        </main>
      </div>
    </>
  );
}
