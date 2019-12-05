/* eslint-disable react/prop-types */
import React from 'react';
import css from './User.css';
import Header from './Header';
import Playlists from './Playlists';
import Footer from './Footer';
import UserService from '../services/userService';

class User extends React.PureComponent {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    user: this.props.user,
  };

  onTogglePlaylist = async (id) => {
    const userService = new UserService();
    userService.toggleSubscription(id);
    this.setState(({ user }) => ({
      user: {
        ...user,
        subscriptions: UserService.toggleSubscription(user.subscriptions, id),
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
