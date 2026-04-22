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

            {/* Where I started from */}
            <section className="fade-trigger">
              <h3>Where I Started From</h3>
              <p>
                When I started this project, I knew very little of CRM's and
                only understood that it was like putting together a lego set.
                You have a bunch of set pieces and organize them yourself.
              </p>
              <p>
                I already had experience building websites in other frameworks,
                so I was able to figure it out pretty quick. The hardest part
                was simply understanding how all of the components fit together
                and what sort of abstractions lie on top. For example, I had to
                learn how the theme builder worked and what it was and was not
                capable of doing. There was a period of trial and error as I
                created, tore down, and rebuilt many features of the site.
              </p>
            </section>

            {/* Things I did */}
            <section className="fade-trigger">
              <h3>Things I Did</h3>
              <p>
                After finding a mild comfort with my new tools, I was able to
                start building out the site. I made several pages for the site,
                paying close attention to accessibility and user experience.
                Choosing the colors and how they interacted with each other was
                quite difficult at times. Often the text displayed on top the
                background colors was difficult to read. Many revisions had to
                be made.
              </p>
              <p>
                Soon after a sprint was finished, the team and I would meet to
                discuss the design and work together to find solutions. One such
                problem was the websites navigation. There were too many pages
                to fit in the navigation bar. Ultimately, we decided on using a
                mega menu and grouped the services together. Learning how to
                create one was quite a challenge. There was no built in way to
                do it so I had to get creative and use a combination of custom
                CSS and widgets to build one. It also created challenges in the
                footer. The menu interacted in strange ways with the footer and
                I had to make a lot of adjustments to get it to work properly.
              </p>
            </section>

            {/* Challenges */}
            <section className="fade-trigger">
              <h3>Challenges</h3>
              <p>
                One feature of the site were galleries of the company's work
                spread throughout the site. Some of these galleries were over
                100 images. I had to consider many things such as site
                performance and user experience. What the team and I decided on
                was to create a 'Load More' button. This way, only a few images
                would be loaded at the start dramatically improving site load
                times and preventing the user from feeling overwhelmed.
                Implementing this feature was the most difficult part of the
                project as, once again, it was not a built in feature and I had
                to custom make everything about it, including the functionality
                and the compatibility with the rest of the site. I had to keep
                in mind that if the client decided that they didn't like how a
                button looked and decided to change it later this button would
                also need to follow those global settings. I also learned how
                difficult it was to get the button to work with built in
                features of Elementor. Finding all of the different css
                selectors and how these other components worked just so I could
                connect to them.
              </p>
              <div className="flex justify-center mt-12">
                <RoundedImage
                  src="/afam-bathrooms-gallery.png"
                  alt="An image of the bathrooms gallery on the Amazing Floors & More website."
                  width={1000}
                />
              </div>
              <p>
                There were many other problems with these galleries as I built
                them. They all needed to function the same way across the site
                and copy and pasting them would lead to subtle differences
                between them that would pain users. I had to create a CSS class
                and JavaScript function that would centralize the work and apply
                it to all galleries that had the correct CSS class applied.
              </p>
              <p>
                Another major issue was the way these images would load in both
                initially and when the 'Load More' button was pressed. The
                images would often overlap each other, shortening the height of
                the page and creating a horrible user experience. As someone who
                struggles with motion sickness, I understood just how big of a
                problem this was. Not only this, but the titles displayed under
                each image could also overlap the image below. I could fix this
                be increasing the padding between each image but if the text was
                too long it would still overlap. Ultimately I fixed all of these
                issues through rigorous manual testing and tweaking of the CSS.
              </p>
              <p>
                The finished project turned out very impressive and the clients
                were very happy with the work as well. I am very grateful for
                the experience and the opportunity to work with such a great
                team and to be trusted with so much responsibility. It was very
                stressful at times but we were able to make it through.
              </p>
            </section>
          </section>
        </main>
      </div>
    </>
  );
}
