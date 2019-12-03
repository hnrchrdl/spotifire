/* eslint-disable react/prop-types */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import css from './Header.css';

function Header({ user }) {
  return (
    <header className={css.header}>
      <div className={css.logo}>
        <span>Spotifire</span>

        <div className={css.user}>
          <FontAwesomeIcon icon={faSpotify} />
          {' '}
          {user.displayName}
        </div>
      </div>
    </header>
  );
}
export default Header;
