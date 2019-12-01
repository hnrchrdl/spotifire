const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyCallbackUri = process.env.SPOTIFY_CALLBACK_URL;

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

const { getUser, toJson } = require('./db');

exports.SpotifyConnetion = new SpotifyWebApi({
  clientId: spotifyClientId,
  clientSecret: spotifyClientSecret,
  redirectUri: spotifyCallbackUri,
});

exports.SpotifyAuthStrategy = new SpotifyStrategy(
  {
    clientID: spotifyClientId,
    clientSecret: spotifyClientSecret,
    callbackURL: spotifyCallbackUri,
  },
  (accessToken, refreshToken, expiresIn, user, done) => {
    const { id } = user;
    const doc = getUser(id);
    toJson(doc).then((userData) => {
      done(null, { ...userData });
    });
  },
);

exports.createSpotifyAuthUrl = () => this.SpotifyConnetion.createAuthorizeURL(
  SPOTIFY_AUTH_SCOPES,
  SPOTIFY_AUTH_STATE,
  false,
);
