/* eslint-disable react/prop-types */
import React from "react";
import css from "./User.css";
import Header from "./Header";
import Playlists from "./Playlists";
import Footer from "./Footer";
import UserService from "../services/userService";
import PlaylistService from "../services/playlistService";
import Toast from "./Toast";

class User extends React.PureComponent {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    user: this.props.user,
    message: undefined,
    showMessage: false,
    messageType: "success"
  };

  // eslint-disable-next-line react/sort-comp
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
          this.toast("subscribed to playlist");
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
          this.toast("unsubscribed to playlist");
        }
      }
    );
  };

  onRefresh = async id => {
    const playlistService = new PlaylistService();
    const { user } = this.state;
    const updatedUser = await playlistService.upsertPlaylist(id, user);
    this.setState({
      user: updatedUser
    });
    this.toast("playlist has been updated");
  };

  clearTimeout;

  toast = (message, clearAfter = 3000, type = "success") => {
    if (this.clearTimeout) clearInterval(this.clearTimeout);
    this.setState({ message, showMessage: true, messageType: type }, () => {
      this.clearTimeout = setTimeout(() => {
        this.setState({ showMessage: false });
        this.clearTimeout = undefined;
      }, clearAfter);
    });
  };

  render() {
    const { playlists } = this.props;
    const { user } = this.state;
    const { message, showMessage, messageType } = this.state;
    return (
      <>
        <Header user={user} />
        <div className={css.container}>
          <div className={css.inner}>
            <Playlists
              playlists={playlists}
              subscriptions={user.subscriptions}
              onToggle={this.onTogglePlaylist}
              onRefresh={this.onRefresh}
              onPlay={() => this.toast("not implemented", undefined, "error")}
            />
          </div>
        </div>
        <Toast message={message} show={showMessage} type={messageType} />
        <Footer />
      </>
    );
  }
}

export default User;
