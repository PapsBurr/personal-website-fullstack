import RoundedImage from "../components/RoundedImage";
import LightsOut from "../components/LightsOut";

export default function Page() {
  return (
    <>
      <div className="container-comp bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 min-h-screen">
        <div></div>
        <main className="flex-auto flex-col justify-between py-24 px-4 md:px-12 lg:px-24 bg-gray-100 text-black">
          
          {/* Opening Section */}
          <section className="fade-trigger">
            <h1>Android apps</h1>
            <p>
              Here are some of the apps I have made throughout my degree. They
              were all made using Java in Android Studio.
            </p>
            <hr></hr>
          </section>

          {/* Vacation Planner App Section */}
          <section className="fade-trigger">
            <h2>Vacation Planner App</h2>
            <p>
              Features a fullstack app. Uses a SQLite database with Java. Includes data validation, 
              basic security, and search functionality.
            </p>
            <p>
              This is the app I made for my B.S. Software Engineering Capstone
              project. It is a planner app where information can be filled
              into fields to plan vacations. It utilizes a SQLite database using
              Room following the repository pattern to store all the information
              that the user stores within the app. It also includes some security 
              measures such as an account system so that only those who know the 
              username and password can access the information relating to them. 
              The database also has security features such as SQL injection input 
              sanitization and password hashing so that the user's sensitive information 
              isn't kept inside the database, only a hash of their password.
            </p>
            <div className="flex flex-row flex-wrap gap-16 justify-center" >
              <RoundedImage
                src="/vacation-planner-login.jpg"
                alt="An image of the vacation planner log in screen."
                width={250}
                height={500}
              />
              <RoundedImage
                src="/vacation-planner-main.jpg"
                alt="An image of the vacation planner main screen"
                width={250}
                height={500}
               />
               <RoundedImage
                src="/vacation-planner-details.jpg"
                alt="An image of the vacation planner details screen"
                width={250}
                height={500}
               />
            </div>
            <p>
              There is also the option to set notifications for when the vacation begins and ends. 
              The same is available for excursions. 
              The vacations can also be shared through SMS and email through the top menu.
            </p>
            <hr></hr>
          </section>

          { /* Lights out Section */ }
          <section className="fade-trigger">
            <h2>Lights out</h2>
            <p>
              This is the app I made to practice Android development. It's a simple game where if you 
              tap on a tile it will invert the tile you tapped and the adjacent tiles. 
              The goal of the game is to turn off all of the tiles. After you win, a toast saying congratulations 
              is played at the bottom of the screen. At any point you can press the New Game button to randomize 
              all the tiles.
            </p>
            <div className="flex justify-center">
              <RoundedImage
                src="/lights-out.jpg"
                alt="An image of the lights out game"
                width={250}
                height={500}
              />
            </div>
            <p>
              It has different navigation options on the bottom that can help you learn the games rules 
              or change the color of the tiles.
            </p>
            <div>
              <LightsOut />
            </div>
            <hr></hr>
          </section>

          { /* Timer App Section */ }
          <section className="fade-trigger">
            <h2>Timer app</h2>
            <p>
              Below is an app that I made to act as a timer for your phone. The timer can be set using the scrollers 
              in the middle of the screen to set how long the timer will go for. The top of the screen shows 
              the amount of time remaining as a number as well as a progress bar. The buttons at the bottom control 
              the timer and change depending on if the timer is running or not. For example, if the timer isn't 
              running it will only show a button that says start.
            </p>
            <div className="flex justify-center">
              <RoundedImage
                src="/timer.jpg"
                alt="An image of the timer app"
                width={250}
                height={500}
              />
            </div>
            <hr></hr>
            <div className="fade-trigger">  
              <h2>Plenty More!</h2>
              <p>
                There are a ton more projects I've done on Android and I'm not going to put them all here. 
                The rest can be found on my GitHub linked at the top of the page.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
