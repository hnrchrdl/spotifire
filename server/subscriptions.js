/* eslint-disable camelcase */
const sampleSize = require("lodash/sampleSize");
const spotify = require("./spotify");

// playlists are identified with their key.
// must have a name, a description and a function named spotifire.
// sporifire takes in the request, with the user property as the spotify user.
// spotifre must return a list of spotify tracks.

module.exports = {
  daily: {
    name: "Spotifire daily",
    description:
      "daily tunes. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    async spotifire({ userId, accessToken, refreshToken, expiresOn }) {
      const connection = await spotify.getAuthenticatedConnection({
        userId,
        accessToken,
        refreshToken,
        expiresOn
      });
      const {
        body: { items: topArtists }
      } = await connection
        .getMyTopArtists({
          limit: 50,
          time_range: "short_term"
        })
        .catch(e => console.log(e));
      const randomArtists = sampleSize(topArtists, 5);
      const seed_artists = randomArtists.map(artist => artist.id);
      const {
        body: { tracks }
      } = await connection
        .getRecommendations({ seed_artists, limit: 50 })
        .catch(e => console.log(e));
      return tracks;
    }
  },
  weekly: {
    name: "Spotifire weekly",
    description:
      "weekly tunes. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    async spotifire({ userId, accessToken, refreshToken, expiresOn }) {
      const connection = await spotify.getAuthenticatedConnection({
        userId,
        accessToken,
        refreshToken,
        expiresOn
      });
      const {
        body: { items: topArtists }
      } = await connection.getMyTopArtists({
        limit: 50,
        time_range: "long_term"
      });
      const randomArtists = sampleSize(topArtists, 5);
      const seed_artists = randomArtists.map(artist => artist.id);
      const {
        body: { tracks }
      } = await connection.getRecommendations({ seed_artists, limit: 50 });
      return tracks;
    }
  }
};
