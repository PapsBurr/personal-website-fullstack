import RoundedImage from "../components/RoundedImage";

export default function Page() {
  return (
    <>
      <div className="page-shell">
        <main className="page-main">
          {/* Websites Title Section */}
          <section className="fade-trigger">
            <h1>Websites</h1>
            <p>Here are some of the websites I've made.</p>
          </section>

          {/* Ecommerce Fullstack Section */}
          <section className="fade-trigger">
            <h2>Ecommerce Fullstack</h2>
            <p>
              Features Angular front-end, Springboot back-end, MySQL Database,
              search functionality, pagination, catalogue categories, data
              validation, field auto-fill, and ordering functionality.
            </p>
            <p>
              This was a massive project for me and has a lot of bells and
              whistles.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/ecommerce-full.jpg"
                alt="An image of the ecommerce website."
                width={1000}
                height={500}
              />
            </div>
            <p>
              The search bar and categories on the sidebar both filter the
              database to only show relavent material. If there is nothing
              matching the search bar or if the back-end is not online the
              screen will show no items and display a message saying nothing is
              available.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/ecommerce-empty.png"
                alt="An image of the ecommerce website."
                width={1000}
                height={500}
              />
            </div>
            <p>
              After adding a few items to cart, you can click the cart button in
              the upper right. This will take you to your cart screen and show
              off all the items and prices. The price and item count next to the
              cart update whenever an item is added. Easy access buttons are
              available for cart items to increase/decrease quantity and even
              remove the item entirely.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/ecommerce-cart.jpg"
                alt="An image of the ecommerce website."
                width={1000}
                height={500}
              />
            </div>
            <p>
              Checking out takes you to... *drumroll*... the checkout screen.
              Amazing. The picture doesn't show it all, but you fill in your
              information here in dropdown boxes and fields. Most of them have
              at least a little bit of input validation such as making sure that
              only numbers are used where appropriate. The expiration field even
              auto sets to the most recent month/year and can't be changed to
              anything earlier. There's also functionality to match the shipping
              address and billing address to prevent the need of typing it all
              again.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/ecommerce-checkout.jpg"
                alt="An image of the ecommerce website."
                width={1000}
                height={500}
              />
            </div>
            <p>
              If you attempt to click purchase without filling in the required
              fields, the website will prevent you from moving on.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/ecommerce-validation.jpg"
                alt="An image of the ecommerce website."
                width={1000}
                height={500}
              />
            </div>
            <p>
              After filling in everything correctly, an order is created with a
              unique order number using UUID and saved within the database.
            </p>
          </section>

          {/* World Map API Section */}
          <section className="fade-trigger">
            <h2>World Map API</h2>
            <p>Features TypeScript with Angular and API usage.</p>
            <p>
              This website allows the user to see information about any country
              in the world. Clicking on any of the countries in the world map
              will send an API request to api.worldbank.org and then display the
              related countries info in the red box on the right.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/world-map-api.jpg"
                alt="An image of the world map api website."
                width={1000}
                height={500}
              />
            </div>
          </section>

          {/* Hotel Reservation Section */}
          <section className="fade-trigger">
            <h2>Hotel Reservation FullStack</h2>
            <p>Features multithreading and a dockerfile.</p>
            <p>
              This website is for reserving a room at a fictional hotel. This
              site contains an ad for a live presentation which has date/time
              conversion based on timezones. At the top of the page is a few
              very out of place lines that are purely to show that
              multithreading is working.
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/reservation-hotel-threads.jpg"
                alt="An image of the reservation hotel website."
                width={1000}
                height={500}
              />
            </div>
            <p>
              You select a start date and an end date and any rooms available in
              that time are shown. Any of these rooms can be reserved, and if
              they are, they will not show up as available during that time
              anymore. The price is displayed in multiple different currencies
              by utilizing pipes to convert them (doesn't covert the actual
              price, just adds the correct symbol).
            </p>
            <div className="flex gap-16 justify-center">
              <RoundedImage
                src="/reservation-hotel-reservations.jpg"
                alt="An image of the reservation hotel website."
                width={1000}
                height={500}
              />
            </div>
            <p>
              The last thing I did with this project is deploy it using Docker
              and AWS.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
