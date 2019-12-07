require("dotenv").config();
const express = require("express");
const nextjs = require("next");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const keygrip = require("keygrip");
const passport = require("passport");
const { SpotifyAuthStrategy, createSpotifyAuthUrl } = require("./spotify");
const Controller = require("./controller");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(SpotifyAuthStrategy);

// Authentication middleware
// eslint-disable-next-line consistent-return
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "not authenticated" });
}

function basicAuth(req, res, next) {
  let username;
  let password;
  try {
    [username, password] = Buffer.from(
      req.headers.authorization.split(" ")[1],
      "base64"
    )
      .toString()
      .split(":");
  } catch (e) {
    res.status(401).json({
      error: `basic auth failed. error decoding auth header ${req.headers.authorization}`
    });
    return;
  }

  if (
    username === process.env.BASIC_AUTH_USER &&
    password === process.env.BASIC_AUTH_PASSWORD
  ) {
    next();
  } else {
    res.status(401).json({
      error: `basic auth failed. header was ${req.headers.authorization}`
    });
  }
}

const dev = process.env.NODE_ENV !== "production";
const app = nextjs({ dev });

const spotifyAuthUrl = createSpotifyAuthUrl();

app
  .prepare()
  .then(() => {
    const server = express();

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

    // Index route
    server.get("/", (req, res) =>
      app.render(req, res, "/index", { spotifyAuthUrl })
    );

    // Spotify auth callback route
    server.get(
      "/auth/spotify/callback",
      passport.authenticate("spotify", { failureRedirect: "/error" }),
      (req, res) => res.redirect("/user")
    );

    // API
    server.get(
      "/api/playlist/available",
      ensureAuthenticated,
      Controller.getAvailablePlaylists
    );
    server.post(
      "/api/playlist/upsert/:id",
      ensureAuthenticated,
      Controller.upsertPlaylist
    );
    server.get("/api/me", ensureAuthenticated, Controller.getMe);
    server.post("/api/me", ensureAuthenticated, Controller.setMe);

    // Cron
    server.get("/api/cron/daily", basicAuth, Controller.getMyRecommendations);

    // All other routes: render next app.
    server.get("*", (req, res) => app.getRequestHandler()(req, res));

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
