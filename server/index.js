require('dotenv').config();
const express = require('express');
const nextjs = require('next');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const keygrip = require('keygrip');
const passport = require('passport');
const { SpotifyAuthStrategy, createSpotifyAuthUrl } = require('./spotify');
const Controller = require('./controller');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(SpotifyAuthStrategy);

const dev = process.env.NODE_ENV !== 'production';
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
        keys: keygrip(['1213324', '14234232']),
      }),
    );

    // Passport
    server.use(passport.initialize());
    server.use(passport.session());

    /*
      Controller
    */

    // Index route
    server.get('/', (req, res) => app.render(req, res, '/index', { spotifyAuthUrl }));

    // Spotify auth callback route
    server.get(
      '/auth/spotify/callback',
      passport.authenticate('spotify', { failureRedirect: '/error' }),
      (req, res) => res.redirect('/user'),
    );

    // API
    server.get('/api/me', Controller.getMe);
    server.post('/api/me', Controller.setMe);
    server.get('/api/playlist/available', Controller.getAvailablePlaylists);

    // All other routes: render next app.
    server.get('*', (req, res) => app.getRequestHandler()(req, res));

    // //////////////////////////////////

    server.listen(process.env.PORT || 3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000"); // eslint-disable-line
    });

    // ////////////////////////////////////
  })
  .catch((ex) => {
    console.error(ex.stack); // eslint-disable-line
    process.exit(1);
  });
