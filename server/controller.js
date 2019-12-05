const { getUser, setUser } = require('./firebase');
const availablePlaylists = require('./playlists.js');

const availablePlaylistData = (Object.entries(availablePlaylists)
  .map(([key, data]) => ({ id: key, name: data.name, description: data.description })));

exports.getAvailablePlaylists = (req, res) => res.json(availablePlaylistData);

exports.getMe = async (req, res) => res.json(await getUser(req.user.id));

exports.setMe = async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  const user = await setUser({ id, ...data });

  res.json(user);
};
