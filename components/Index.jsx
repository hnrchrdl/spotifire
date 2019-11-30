import React from 'react';
import propTypes from 'prop-types';
import css from './Index.css';

class Index extends React.PureComponent {
  render() {
    const { spotifyAuthUrl } = this.props;
    return (
      <div className={css.container}>
        <div>
          <div className={css.logo}>Spotifire</div>
          <div className={css.linkContainer}>
            <a className={css.link} href={spotifyAuthUrl}>
              Login with Spotify
            </a>
          </div>
        </div>
      </div>
    );
  }
}
Index.propTypes = {
  spotifyAuthUrl: propTypes.string.isRequired,
};
export default Index;
