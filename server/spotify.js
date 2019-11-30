const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyPool {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.pool = {
      __default__: new SpotifyWebApi({
        clientId,
        clientSecret,
        redirectUri,
      }),
    };
  }

  registerUser(id, accessToken, refreshToken) {
    const connection = new SpotifyWebApi({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
    });
    connection.setAccessToken(accessToken);
    connection.setRefreshToken(refreshToken);
    this.pool[id] = connection;
    return this.pool[id];
  }

  getConnectionForUser(req) {
    if (!req.user) {
      throw new Error('Unexpected error: User not found on request.');
    }

    const {
      user: { id, accessToken },
    } = req;

    const connection = this.pool[id];

    if (!connection && !accessToken) {
      throw new Error(`Spotify connection for user ${id} not found`);
    }
    if (!connection) {
      // Register User without refreshToken
      // TODO Save refresh token persistently.
      return this.registerUser(id, accessToken);
    }

    if (!connection.getAccessToken()) {
      throw new Error(`Spotify connection for user ${id} not authenticated`);
    }
    return connection;
  }

  getDefaultConnection() {
    return this.pool.__default__; // eslint-disable-line
  }
}

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_CALLBACK_URL;

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error(
    `Error reading spotify settings from env file!
        Set 'SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET' and 'REDIRECT_URI'
        in your node environment`,
  );
}

module.exports = new SpotifyPool(clientId, clientSecret, redirectUri);
