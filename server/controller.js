const { getUser, setUser } = require('./firebase');
const availablePlaylists = require('./playlists.js');
const spotify = require('./spotify');

const availablePlaylistData = (Object.entries(availablePlaylists)
  .map(([key, data]) => ({ id: key, name: data.name, description: data.description })));

exports.getAvailablePlaylists = (req, res) => res.json(availablePlaylistData);

exports.upsertPlaylist = (req, res) => {
  console.log(req.param.id);
  res.json({});
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
