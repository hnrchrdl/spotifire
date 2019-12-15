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
  onRefresh
}) {
  return playlists.map(playlist => {
    const subscription = subscriptions[playlist.id] || {};
    const { playlistDetails = {} } = subscription;
    return (
      <div key={playlist.id} className={css.playlist}>
        <div className={css.imageContainer}>
          <div className={css.imageWrapper}>
            <img
              className={css.image}
              src={playlist.image}
              alt={playlist.name}
            />
          </div>
          <div className={css.actionItems}>
            <a
              href={playlistDetails.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faEye} size="1x" />
            </a>
            {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus  */}
            <span onClick={() => onRefresh(playlist.id)} role="button">
              <FontAwesomeIcon icon={faRedo} size="1x" />
            </span>
            <FontAwesomeIcon icon={faPlay} size="1x" />
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
          {playlistDetails &&
            playlistDetails.external_urls &&
            playlistDetails.external_urls.spotify && (
              <>
                {subscription.updatedOn && (
                  <div>
                    Last update:{" "}
                    {timeSince(
                      // eslint-disable-next-line no-underscore-dangle
                      new Date(subscription.updatedOn._seconds * 1000)
                    )}{" "}
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    );
  });
}

export default Playlists;
