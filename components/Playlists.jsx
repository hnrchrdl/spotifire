import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff } from '@fortawesome/free-solid-svg-icons';
import css from './Playlists.css';

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
        <span className={css.check}><FontAwesomeIcon icon={faToggleOff} /></span>
      </div>
      <div className={css.description}>
        { playlist.description }
      </div>
    </div>
  ));
}

export default Playlists;
