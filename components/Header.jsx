/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import css from "./Header.css";

function Header({ user }) {
  return (
    <header className={css.header}>
      <span className={css.logo}>
        <img src="/static/logo_text_40.png" alt="logo" />
      </span>

      <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faSpotify} /> {user.displayName}
      </a>
    </header>
  );
}
export default Header;
