// /* eslint-disable camelcase */
// const passport = require('passport');
// const renderIndex = require('./renderIndex');
// const Spotify = require('../spotify');
// const handleSpotifyError = require('../errorHandler').spotify;
// const ensureAuth = require('../middleware/ensureAuthenticated');

// function parseAndSendSpotifyResponse(res) {
//   return response => res.json(response.body);
// }

// function getRecommendations(conn, data) {
//   const options = {
//     ...(data.genres.length ? { seed_genres: data.genres } : {}),
//     ...(data.tracks ? { seed_tracks: data.tracks } : {}),
//     ...(data.artists ? { seed_artists: data.artists } : {}),
//     ...(data.limit ? { limit: data.limit } : {}),
//     ...[
//       'acousticness',
//       'danceability',
//       'energy',
//       'instrumentalness',
//       'liveness',
//       'loudness',
//       'popularity',
//       'speechiness',
//       'valence',
//     ].reduce(
//       (result, key) => ({
//         ...result,
//         ...(data[key] && data[key].min > 0
//           ? { [`min_${key}`]: data[key].min }
//           : {}),
//         ...(data[key] && data[key].max < 1
//           ? { [`max_${key}`]: data[key].max }
//           : {}),
//       }),
//       {},
//     ),
//     ...['key', 'mode', 'tempo', 'time_signature'].reduce(
//       (result, key) => ({
//         ...result,
//         ...(data[key] !== null ? { [`target_${key}`]: data[key] } : {}),
//       }),
//       {},
//     ),
//   };
//   if (Object.keys(options).length < 1) {
//     throw new Error({
//       error: 'Missing request data for spotify recommendations.',
//     });
//   }
//   return conn.getRecommendations(options);
// }

// module.exports = (server, app) => {
//   // Start Screen
//   server.get('/', renderIndex(app));

//   // Spotify callback
//   server.get(
//     '/auth/spotify/callback',
//     passport.authenticate('spotify', { failureRedirect: '/' }),
//     (req, res) => res.redirect('/user'),
//   );

//   // API
//   server.get('/api/v1/genres', ensureAuth({ redirect: false }), (req, res) => {
//     const conn = Spotify.getConnectionForUser(req);
//     conn
//       .getAvailableGenreSeeds()
//       .then(parseAndSendSpotifyResponse(res))
//       .catch(handleSpotifyError(res, conn));
//   });

//   server.get(
//     '/api/v1/topArtists',
//     ensureAuth({ redirect: false }),
//     (req, res) => {
//       const conn = Spotify.getConnectionForUser(req);
//       conn
//         .getMyTopArtists()
//         .then(parseAndSendSpotifyResponse(res))
//         .catch(handleSpotifyError(res, conn));
//     },
//   );

//   server.get(
//     '/api/v1/topTracks',
//     ensureAuth({ redirect: false }),
//     (req, res) => {
//       const conn = Spotify.getConnectionForUser(req);
//       conn
//         .getMyTopTracks()
//         .then(parseAndSendSpotifyResponse(res))
//         .catch(handleSpotifyError(res, conn));
//     },
//   );

//   server.post(
//     '/api/v1/recommendations',
//     ensureAuth({ redirect: false }),
//     (req, res) => {
//       const { body: data } = req;
//       const conn = Spotify.getConnectionForUser(req);
//       getRecommendations(conn, data)
//         .then(parseAndSendSpotifyResponse(res))
//         .catch(handleSpotifyError(res, conn));
//     },
//   );

//   server.post(
//     '/api/v1/savePlaylist',
//     ensureAuth({ redirect: false }),
//     (req, res) => {
//       const { body: data } = req;
//       const { name, isPublic, tracks } = data;
//       const conn = Spotify.getConnectionForUser(req);
//       conn
//         .createPlaylist(name, { public: isPublic })
//         .then(parseAndSendSpotifyResponse(res))
//         .catch((err) => {
//           handleSpotifyError(res, conn)(err);
//         });
//     },
//   );

//   // Render app on all other requests.
//   server.get('*', ensureAuth(), (req, res) => app.getRequestHandler()(req, res));
// };
