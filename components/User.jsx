/* eslint-disable react/prop-types */
import React from 'react';
import css from './User.css';
import Header from './Header';
import Playlists from './Playlists';
import Footer from './Footer';
import UserService from '../services/userService';
import PlaylistService from '../services/playlistService';

class User extends React.PureComponent {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    user: this.props.user,
  };

  onTogglePlaylist = async (id) => {
    const userService = new UserService();
    userService.togglePlaylist(id);
    this.setState(({ user }) => ({
      user: {
        ...user,
        playlists: PlaylistService.togglePlaylist(user.playlists, id),
      },
    }));
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
              subscribed={user.playlists}
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
