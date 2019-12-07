/* eslint-disable camelcase */
const sampleSize = require('lodash/sampleSize');
const spotify = require('./spotify');

// playlists are identified with their key.
// must have a name, a description and a function named spotifire.
// sporifire takes in the request, with the user property as the spotify user.
// spotifre must return a list of spotify tracks.

module.exports = {
  daily: {
    name: 'Spotifire daily',
    description: "daily tunes. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    async spotifire(req) {
      const connection = await spotify.getAuthenticatedConnection(req);
      const { body: { items: topArtists } } = await connection.getMyTopArtists({ limit: 50, time_range: 'short_term' });
      const randomArtists = sampleSize(topArtists, 5);
      const seed_artists = randomArtists.map(artist => artist.id);
      const { body: { tracks } } = await connection.getRecommendations({ seed_artists, limit: 50 });
      return tracks;
    },
  },
  weekly: {
    name: 'Spotifire weekly',
    description: "weekly tunes. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    spotifire(req) {
      return Promise.resolve({ moin: 'moin' });
    },
  },
};
