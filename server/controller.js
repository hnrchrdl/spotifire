const { getUser } = require('./firebase');
const availablePlaylists = require('../data/playlists.json');

exports.getAvailablePlaylists = (req, res) => res.json(availablePlaylists);

exports.getMe = async (req, res) => res.json(await getUser(req.user.id));
