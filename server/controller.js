const { getUser, setUser } = require('./firebase');
const availablePlaylists = require('../data/playlists.json');

exports.getAvailablePlaylists = (req, res) => res.json(availablePlaylists);

exports.getMe = async (req, res) => res.json(await getUser(req.user.id));

exports.setMe = async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  const user = await setUser({ id, ...data });

  res.json(user);
};
