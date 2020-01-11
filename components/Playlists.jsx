/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import { faPlay, faEye, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toggle from "./Toggle";
import { timeSince } from "../helper/date";
import css from "./Playlists.css";

function Playlists({
  playlists = [],
  subscriptions = {},
  onToggle,
  onRefresh,
  onPlay
}) {
  return playlists.map(playlist => {
    const subscription = subscriptions[playlist.id] || {};
    const { playlistDetails = {} } = subscription;
    return (
      <React.Fragment key={playlist.id}>
        <div className={css.playlist}>
          <div className={css.imageContainer}>
            <div className={css.imageWrapper}>
              <img
                className={css.image}
                src={`data:${playlist.imageType};base64,${playlist.image}`}
                alt={playlist.name}
              />
            </div>
            <div className={css.actionItems}>
              {playlistDetails &&
                playlistDetails.external_urls &&
                playlistDetails.external_urls.spotify && (
                  <>
                    <a
                      href={playlistDetails.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faEye} size="1x" />
                    </a>
                    <span onClick={() => onRefresh(playlist.id)} role="button">
                      <FontAwesomeIcon icon={faRedo} size="1x" />
                    </span>
                    <span onClick={onPlay} role="button">
                      <FontAwesomeIcon icon={faPlay} size="1x" />
                    </span>
                  </>
                )}
            </div>
          </div>
          <div>
            <div className={css.heading}>
              <span className={css.title}>{playlist.name}</span>
              <Toggle
                onClick={() => onToggle(playlist.id)}
                enabled={Boolean(subscription.enabled)}
              />
            </div>
            <div className={css.description}>{playlist.description}</div>
            {subscription.updatedOn && (
              <div>
                Last update:{" "}
                {timeSince(
                  // eslint-disable-next-line no-underscore-dangle
                  new Date(subscription.updatedOn._seconds * 1000)
                )}{" "}
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  });
}

export default Playlists;
