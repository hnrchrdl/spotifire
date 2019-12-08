/* eslint-disable camelcase */
const pick = require("lodash/pick");
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

const getAvailablePlaylists = (req, res) => res.json(availablePlaylistData);

const upsertPlaylist = async (req, res) => {
  const { id: subscriptionId } = req.params;
  const { user } = req.body;

  const subscription = subscriptions[subscriptionId];
  const tracks = await subscription
    .spotifire(
      {
        userId: user.id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresOn: user.expiresOn
      },
      req
    )
    .catch(e => console.log(e));

  const connection = await spotify
    .getAuthenticatedConnection(
      {
        userId: user.id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresOn: user.expiresOn
      },
      req
    )
    .catch(e => console.log(e));

  let spotifyPlaylist;
  if (
    user &&
    user.subscriptions &&
    user.subscriptions[subscriptionId] &&
    user.subscriptions[subscriptionId].playlistDetails
  ) {
    try {
      const existingPlaylist = await connection.getPlaylist(
        user.subscriptions[subscriptionId].playlistDetails.id
      );
      spotifyPlaylist = existingPlaylist.body;
    } catch (e) {
      //
      console.log(e);
    }
  }
  if (!spotifyPlaylist) {
    const newPlaylist = await connection
      .createPlaylist(user.id, subscription.name)
      .catch(e => console.log(e));
    spotifyPlaylist = newPlaylist.body;
  }

  await connection
    .replaceTracksInPlaylist(
      spotifyPlaylist.id,
      tracks.map(track => track.uri)
    )
    .catch(e => console.log(e));

  const playlist = await connection
    .getPlaylist(spotifyPlaylist.id)
    .catch(e => console.log(e));

  const updatedUser = await setUser({
    id: user.id,
    subscriptions: {
      ...user.subscriptions,
      [subscriptionId]: {
        enabled: true,
        playlistDetails: pick(playlist.body, [
          "id",
          "href",
          "uri",
          "images",
          "name",
          "external_urls"
        ]),
        updatedOn: new Date()
      }
    }
  }).catch(e => console.log(e));

  res.json(updatedUser);
};

const getMe = async (req, res) => res.json(await getUser(req.user.id));

const setMe = async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  const user = await setUser({ id, ...data });

  res.json(user);
};

// eslint-disable-next-line consistent-return
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "not authenticated" });
}

module.exports = server => {
  server.get(
    "/api/playlist/available",
    ensureAuthenticated,
    getAvailablePlaylists
  );
  server.post("/api/playlist/upsert/:id", ensureAuthenticated, upsertPlaylist);
  server.get("/api/me", ensureAuthenticated, getMe);
  server.post("/api/me", ensureAuthenticated, setMe);
};
