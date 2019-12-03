import React from 'react';
import css from './Playlists.css';
import Toggle from './Toggle';

function Playlists({ playlists }) {
  if (!playlists || !playlists.length) {
    return null;
  }
  return playlists.map(playlist => (
    <div key={playlist.id} className={css.playlist}>
      <div className={css.heading}>
        <span className={css.title}>
          { playlist.name }
        </span>
        <Toggle />
      </div>
      <div className={css.description}>
        { playlist.description }
      </div>
    </div>
  ));
}

export default Playlists;
