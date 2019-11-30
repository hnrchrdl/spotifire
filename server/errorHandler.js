exports.generic = function (res) {
  return function (err) {
    console.error(res, err); // eslint-disable-line
    res.status(500).json(process.env.production ? null : err);
  };
};
exports.spotify = function (res) {
  return function (err) {
    return res.status(500).json(process.env.production ? null : err);
  };
};
