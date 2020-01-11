require("dotenv").config();
const express = require("express");
const nextjs = require("next");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const keygrip = require("keygrip");
const passport = require("passport");
const Sentry = require("@sentry/node");
const { SpotifyAuthStrategy, createSpotifyAuthUrl } = require("./spotify");
const registerApiController = require("./api");
const registerCronController = require("./cron");

if (process.env.ENVIRONMENT === "production")
  Sentry.init({
    dsn: "https://cab4717383294fddaac94420e0136ddc@sentry.io/1849816"
  });

if (!("toJSON" in Error.prototype))
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Error.prototype, "toJSON", {
    value() {
      const alt = {};

      Object.getOwnPropertyNames(this).forEach(function(key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true
  });

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(SpotifyAuthStrategy);

const dev = process.env.NODE_ENV !== "production";
const app = nextjs({ dev });

const spotifyAuthUrl = createSpotifyAuthUrl();

app
  .prepare()
  .then(() => {
    const server = express();

    if (process.env.ENVIRONMENT === "production")
      server.use(Sentry.Handlers.requestHandler());

    /*
      Middleware
    */

    // Body parser
    server.use(bodyParser.json());

    // Cookies sessions
    server.use(
      cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: keygrip(["1213324", "14234232"])
      })
    );

    // Passport
    server.use(passport.initialize());
    server.use(passport.session());

    /*
      Controller
    */

    // Index
    server.get("/", (req, res) =>
      app.render(req, res, "/index", { spotifyAuthUrl })
    );

    // Spotify auth callback
    server.get(
      "/auth/spotify/callback",
      passport.authenticate("spotify", { failureRedirect: "/error" }),
      (req, res) => res.redirect("/user")
    );

    // API
    registerApiController(server);

    // Cron
    registerCronController(server);

    // All other routes: render next app.
    server.get("*", (req, res) => {
      app.getRequestHandler()(req, res);
    });

    if (process.env.ENVIRONMENT === "production")
      server.use(Sentry.Handlers.errorHandler());

    // //////////////////////////////////

    server.listen(process.env.PORT || 3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000"); // eslint-disable-line
    });

    // ////////////////////////////////////
  })
  .catch(ex => {
    console.error(ex.stack); // eslint-disable-line
    process.exit(1);
  });
