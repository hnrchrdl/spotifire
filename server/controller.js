/* eslint-disable camelcase */
const { getUser, setUser } = require('./firebase');
const availablePlaylists = require('./playlists.js');
const spotify = require('./spotify');

const availablePlaylistData = Object.entries(availablePlaylists).map(
  ([key, data]) => ({
    id: key,
    name: data.name,
    description: data.description,
  }),
);

exports.getAvailablePlaylists = (req, res) => res.json(availablePlaylistData);

exports.upsertPlaylist = async (req, res) => {
  let updatedUser;
  try {
    const { id: playlistId } = req.params;
    const { user } = req.body;
    const playlist = availablePlaylists[playlistId];
    const tracks = await playlist.spotifire(req);
    const { subscriptions } = user;
    const subscription = subscriptions[playlistId];
    const connection = await spotify.getAuthenticatedConnection(req);
    let spotifyPlaylist;
    if (!subscription.playlistDetails) {
      // no playlist found
      const newPlaylist = await connection.createPlaylist(
        user.id,
        playlist.name,
      );
      spotifyPlaylist = newPlaylist.body;
    } else {
      // playlist existing?
      try {
        const existingPlaylist = await connection.getPlaylist(
          subscription.playlistDetails.id,
        );
        spotifyPlaylist = existingPlaylist.body;
      } catch (e) {
        console.log(e);
        const newPlaylist = await connection.createPlaylist(
          user.id,
          playlist.name,
        );
        spotifyPlaylist = newPlaylist.body;
      }
    }
    await connection.replaceTracksInPlaylist(
      spotifyPlaylist.id,
      tracks.map(track => track.uri),
    );
    const {
      body: {
        id, href, external_urls, description, images, name, uri,
      },
    } = await connection.getPlaylist(spotifyPlaylist.id);
    updatedUser = await setUser({
      id: user.id,
      subscriptions: {
        ...subscriptions,
        [playlistId]: {
          ...subscription,
          playlistDetails: {
            id,
            href,
            external_urls,
            description,
            images,
            name,
            uri,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
  res.json(updatedUser);
};

exports.getMe = async (req, res) => res.json(await getUser(req.user.id));

exports.setMe = async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  const user = await setUser({ id, ...data });

  res.json(user);
};

exports.getMyRecommendations = async (req, res) => {
  const connection = await spotify.getAuthenticatedConnection(req);
  res.json(await connection.getMyTopTracks());
};
