import React from "react";
import propTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import css from "./Index.css";

class Index extends React.PureComponent {
  render() {
    const { spotifyAuthUrl } = this.props;
    return (
      <div className={css.container}>
        <img src="/static/logo_text_100.png" alt="logo" />

        <a className={css.link} href={spotifyAuthUrl}>
          <FontAwesomeIcon icon={faSpotify} size="3x" />
          <br />
          <br />
          Login with Spotify
        </a>
      </div>
    );
  }
}
Index.propTypes = {
  spotifyAuthUrl: propTypes.string.isRequired
};
export default Index;
