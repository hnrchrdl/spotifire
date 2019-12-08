/* eslint-disable react/prop-types */
import React from "react";
import css from "./User.css";
import Header from "./Header";
import Playlists from "./Playlists";
import Footer from "./Footer";
import UserService from "../services/userService";
import PlaylistService from "../services/playlistService";

class User extends React.PureComponent {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    user: this.props.user
  };

  onTogglePlaylist = async id => {
    const userService = new UserService();
    const playlistService = new PlaylistService();

    let enabled;
    this.setState(
      ({ user }) => {
        enabled = !((user.subscriptions || {})[id] || {}).enabled;

        return {
          user: {
            ...user,
            subscriptions: {
              ...(user.subscriptions || {}),
              [id]: {
                ...(enabled ? (user.subscriptions || {})[id] || {} : {}),
                enabled
              }
            }
          }
        };
      },
      async () => {
        const { user } = this.state;
        if (enabled) {
          const updatedUser = await playlistService.upsertPlaylist(id, user);
          this.setState({
            user: updatedUser
          });
        } else {
          userService.setMe({
            subscriptions: {
              ...user.subscriptions,
              [id]: {
                enabled: false,
                playlistDetails: null
              }
            }
          });
        }
      }
    );
  };

  render() {
    const { playlists } = this.props;
    const { user } = this.state;
    return (
      <>
        <Header user={user} />
        <div className={css.container}>
          <div className={css.inner}>
            <Playlists
              playlists={playlists}
              subscriptions={user.subscriptions}
              onToggle={this.onTogglePlaylist}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default User;
