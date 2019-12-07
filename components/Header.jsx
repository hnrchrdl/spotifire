/* eslint-disable react/prop-types */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import css from "./Header.css";

function Header({ user }) {
  return (
    <header className={css.header}>
      <span className={css.logo}>Spotifire</span>
      <div className={css.user}>
        <FontAwesomeIcon icon={faSpotify} /> {user.displayName}
      </div>
    </header>
  );
}
export default Header;
