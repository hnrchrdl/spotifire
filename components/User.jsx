/* eslint-disable react/prop-types */
import React from 'react';
import css from './User.css';
import Header from './Header';
import Playlists from './Playlists';
import Footer from './Footer';

class Index extends React.PureComponent {
  render() {
    const { user, playlists } = this.props;
    return (
      <>
        <Header user={user} />
        <div className={css.container}>
          <div className={css.inner}>
            <Playlists playlists={playlists} />
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default Index;
