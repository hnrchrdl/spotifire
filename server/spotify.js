/* eslint-disable camelcase */
const SpotifyStrategy = require("passport-spotify").Strategy;
const SpotifyWebApi = require("spotify-web-api-node");
const { setUser } = require("./firebase");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_CALLBACK_URL;

// minimize auth scope usage.
const SPOTIFY_AUTH_SCOPES = [
  "user-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-private",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-library-modify",
  "user-library-read",
  "user-read-recently-played",
  "user-top-read"
];
// TODO randomize?
const SPOTIFY_AUTH_STATE = "fdsaoiewjiewoiagre4234wegegsewaoi";

exports.getAuthenticatedConnection = (
  { userId, accessToken, refreshToken, expiresOn },
  req
) => {
  const connection = new SpotifyWebApi({ clientId, clientSecret, redirectUri });

  connection.setAccessToken(accessToken);
  if (new Date() > new Date(expiresOn)) {
    try {
      console.log("refresh");
      connection.setRefreshToken(refreshToken);
      return connection.refreshAccessToken().then(data => {
        const { access_token, expires_in } = data.body;
        connection.setAccessToken(access_token);
        const newExpiresOn = new Date();
        newExpiresOn.setSeconds(newExpiresOn.getSeconds() + expires_in);
        if (req) {
          req.session.passport.user.accessToken = access_token;
          req.session.passport.user.expiresOn = newExpiresOn;
        }
        return setUser({
          id: userId,
          accessToken: access_token,
          expiresOn: newExpiresOn
        }).then(() => connection);
      });
    } catch (e) {
      return connection;
    }
  }
  return Promise.resolve(connection);
};

exports.SpotifyConnetion = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri
});

exports.SpotifyAuthStrategy = new SpotifyStrategy(
  {
    clientID: clientId,
    clientSecret,
    callbackURL: redirectUri
  },
  async (accessToken, refreshToken, expiresIn, profile, done) => {
    try {
      const expiresOn = new Date();
      expiresOn.setSeconds(expiresOn.getSeconds() + expiresIn);
      const user = {
        accessToken,
        refreshToken,
        expiresIn,
        expiresOn,
        ...profile
      };
      await setUser(user);

      done(null, user);
    } catch (e) {
      done(e);
    }
  }
);

exports.createSpotifyAuthUrl = () =>
  this.SpotifyConnetion.createAuthorizeURL(
    SPOTIFY_AUTH_SCOPES,
    SPOTIFY_AUTH_STATE,
    false
  );
