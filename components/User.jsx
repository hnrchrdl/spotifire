/* eslint-disable react/prop-types */
import React from 'react';
import css from './Index.css';

class Index extends React.PureComponent {
  render() {
    const { user, playlists } = this.props;
    return (
      <div className={css.container}>
        Hi
        {' '}
        {user.displayName}
        <button type="button">start</button>
        <button type="button">stop</button>
        <div>
          { playlists.map(playlist => <span key={playlist.id}>{ playlist.id + playlist.name }</span>) }
        </div>
      </div>
    );
  }
}

export default Index;
