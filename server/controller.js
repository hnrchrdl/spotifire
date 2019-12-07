/* eslint-disable camelcase */
const { getUser, setUser } = require("./firebase");
const subscriptions = require("./subscriptions.js");
const spotify = require("./spotify");

const availablePlaylistData = Object.entries(subscriptions).map(
  ([key, data]) => ({
    id: key,
    name: data.name,
    description: data.description
  })
);

exports.getAvailablePlaylists = (req, res) => res.json(availablePlaylistData);

exports.upsertPlaylist = async (req, res) => {
  let updatedUser;
  try {
    const { id: subscriptionId } = req.params;
    const { user } = req.body;

    const subscription = subscriptions[subscriptionId];
    const tracks = await subscription.spotifire(req);

    const connection = await spotify.getAuthenticatedConnection(req);
    let spotifyPlaylist;

    if (subscription.playlistDetails) {
      // subscription has playlist details.
      try {
        const existingPlaylist = await connection.getPlaylist(
          subscription.playlistDetails.id
        );
        // playlist DOES EXIST on spotify account.
        spotifyPlaylist = existingPlaylist.body;
      } catch (e) {
        // todo: check error.
        // playlist DOES NOT EXIST on spotify account.
      }
    }
    if (!spotifyPlaylist) {
      const newPlaylist = await connection.createPlaylist(
        user.id,
        subscription.name
      );
      spotifyPlaylist = newPlaylist.body;
    }

    await connection.replaceTracksInPlaylist(
      spotifyPlaylist.id,
      tracks.map(track => track.uri)
    );
    const {
      body: { id, href, external_urls, description, images, name, uri }
    } = await connection.getPlaylist(spotifyPlaylist.id);
    updatedUser = await setUser({
      id: user.id,
      subscriptions: {
        ...subscriptions,
        [subscriptionId]: {
          ...subscription,
          playlistDetails: {
            id,
            href,
            external_urls,
            description,
            images,
            name,
            uri
          }
        }
      }
    });
  } catch (e) {
    // to do: error handling.
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
