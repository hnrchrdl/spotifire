// const Spotify = require('../spotify');

const whiteList = ['/'];

// Simple route middleware to ensure user is authenticated.
function authMiddleware(
  // { redirectPath = '/', redirect = true } = {}
) {
  return function (req, res, next) {
    console.log(req.url, req.path);
    if (whiteList.includes(req.path) || req.isAuthenticated()) {
      // check if spotify connection is expired
      // in that case refresh token if possible.
      // otherwise redirect back to homepage
      // if (new Date() > req.user.expireDateTime) {
      //   const conn = Spotify.getConnectionForUser(req);
      //   if (conn.getRefreshToken()) {
      //     return conn.refreshAccessToken().then(
      //       (data) => {
      //         console.info('The access token has been refreshed!'); // eslint-disable-line

      //         conn.setAccessToken(data.body.access_token);
      //         conn.setRefreshToken(data.body.refresh_token);
      //         return next();
      //       },
      //       (_err) => {
      //         // error refreshing token
      //         console.error('Could not refresh access token', _err); // eslint-disable-line
      //         return res.redirect('/');
      //       },
      //     );
      //   }
      // return res.redirect('/');
      // }
      return next();
    }
    // return redirect
    //   ? res.redirect(redirectPath)
    //   : res.status(401).json({ error: 'not authenticated' });
    return res.redirect('/not_authenticated');
  };
}

module.exports = authMiddleware;
