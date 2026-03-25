import Link from "next/link";
import RoundedImage from "../components/RoundedImage";

export default function Page() {
  return (
    <>
      <div className="page-shell">
        <main className="page-main">
          {/* Opening Section */}
          <section className="fade-trigger">
            <h1>Experience</h1>
          </section>

          {/* WordPress Section */}
          <section className="fade-trigger">
            <h2>WordPress - Elementor</h2>
            <p>
              Early in my web dev career, I collaborated remotely with a small
              team to redesign and rebuild a website for a flooring business in
              Jacksonville, Florida. Working together from different locations,
              we created a new website for them with fresh branding and a new
              design.
            </p>
            <p>
              I was responsible for actually building the site. I handled the
              layout of the site and creating the flow for the user, ensuring a
              smooth and intuitive experience.
            </p>
            <div className="my-8 flex flex-wrap gap-4">
              <div>
                <Link
                  href="https://amazingfloorsandmore.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button"
                >
                  Visit the Website
                </Link>
              </div>
            </div>

            {/* Image of the website */}
            <div className="flex justify-center mt-12">
              <RoundedImage
                src="/afam-homepage-full.png"
                alt="An image of the Amazing Floors & More homepage."
                width={1000}
              />
            </div>

            {/* Walkthrough of the site */}
            <section className="fade-trigger">
              <h3>Walkthrough</h3>
              <p>
                The homepage features a hero section with a clear call to
                action, followed by sections that highlight the company's
                services, a gallery of their work, and customer testimonials.
                The design is clean and modern, with a focus on showcasing the
                quality of their flooring services and their friendly nature.
              </p>
            </section>

            {/* Things I did */}

            {/* Custom Components and thought process */}

            {/* Working with the clients */}
          </section>
        </main>
      </div>
    </>
  );
}
