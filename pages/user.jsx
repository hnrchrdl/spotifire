import React from "react";
import User from "../components/User";
import UserService from "../services/userService";
import PlaylistService from "../services/playlistService";

class UserPage extends React.PureComponent {
  static getInitialProps = async ({ req, res }) => {
    if (!req.user) {
      res.writeHead(302, {
        Location: "/"
      });
      res.end();
      return {};
    }
    const userService = new UserService(req);
    const user = await userService.getMe();

    const playlistService = new PlaylistService(req);
    const playlists = await playlistService.getAvailable();

    return { user: user || {}, playlists };
  };

  render() {
    const { props } = this;
    return <User {...props} />;
  }
}

export default UserPage;
