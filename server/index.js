require('dotenv').config();
const express = require('express');
const nextjs = require('next');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const keygrip = require('keygrip');
const SpotifyStrategy = require('passport-spotify').Strategy;
const passport = require('passport');
const admin = require('firebase-admin');
const SpotifyConnection = require('./spotify').getDefaultConnection();

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const callbackURL = process.env.SPOTIFY_CALLBACK_URL;

/*
  Firebase
*/
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://spotifire-8f25c.firebaseio.com',
});

/*
  Spotify
*/
// minimize auth scope usage.
const SPOTIFY_AUTH_SCOPES = [
  'user-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'playlist-read-private',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-modify',
  'user-library-read',
  'user-read-recently-played',
  'user-top-read',
];
// TODO randomize?
const SPOTIFY_AUTH_STATE = 'fdsaoiewjiewoiagre4234wegegsewaoi';
const spotifyAuthUrl = SpotifyConnection.createAuthorizeURL(
  SPOTIFY_AUTH_SCOPES,
  SPOTIFY_AUTH_STATE,
  false,
);

/*
  Passport
*/
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    (accessToken, refreshToken, expiresIn, user, done) => {
      const db = admin.firestore();
      const { id } = user;
      const userDocRef = db.collection('users').doc(id);
      userDocRef.set(user, { merge: true });
      userDocRef.get().then((userDataSnapshot) => {
        done(null, { ...userDataSnapshot.data() });
      });
    },
  ),
);

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });

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
    server.get('/api/me', (req, res) => res.json(req.user));

    // // All other routes: render next app.
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
