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
  let updatedUser;
  try {
    const { id: subscriptionId } = req.params;
    const { user } = req.body;

    if (!subscriptionId || !user || !user.id) {
      res.status(400).json({ error: "no subscriptionId or user given" });
      return;
    }

    const subscription = subscriptions[subscriptionId];
    const tracks = await subscription.spotifire(req);

    if (!tracks || !tracks.length) {
      res.status(400).json({ error: "no tracks found" });
      return;
    }

    let connection;
    try {
      connection = await spotify.getAuthenticatedConnection(req);
    } catch (e) {
      res
        .status(500)
        .json({ ...e, error: "could not get authenticated connection" });
      return;
    }

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
        if (e.statusCode && e.statusCode.toString() !== "404") {
          res
            .status(500)
            .json({ ...e.toJSON(), error: "error getting playlist" });
          return;
        }
      }
    }
    if (!spotifyPlaylist) {
      try {
        const newPlaylist = await connection.createPlaylist(
          user.id,
          subscription.name
        );
        spotifyPlaylist = newPlaylist.body;
        console.log("created");
      } catch (e) {
        res
          .status(500)
          .json({ ...e, error: "could not create new spotify playlist" });
        return;
      }
    }
    if (!spotifyPlaylist) {
      res
        .status(500)
        .json({ error: "unexpected error: could not get spotify playlist" });
      return;
    }
    await connection.replaceTracksInPlaylist(
      spotifyPlaylist.id,
      tracks.map(track => track.uri)
    );

    const playlist = await connection.getPlaylist(spotifyPlaylist.id);
    try {
      updatedUser = await setUser({
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
            ])
          }
        }
      });
    } catch (e) {
      res.status(500).json({
        ...e,
        error: "unexpected error: could not save user data"
      });
    }
  } catch (e) {
    // to do: error handling.
    res.status(500).json(e);
    return;
  }
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
