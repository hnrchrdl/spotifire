import React from "react";
import css from "./Playlists.css";
import Toggle from "./Toggle";

function Playlists({ playlists = [], subscriptions = {}, onToggle }) {
  return playlists.map(playlist => {
    const subscription = subscriptions[playlist.id] || {};
    const { playlistDetails = {} } = subscription;
    return (
      <div key={playlist.id} className={css.playlist}>
        {playlistDetails &&
        playlistDetails.images &&
        playlistDetails.images.length ? (
          <div className={css.imageContainer}>
            <img
              className={css.image}
              src={playlistDetails.images[0].url}
              alt={playlist.name}
            />
          </div>
        ) : (
          <div className={css.imageContainer} />
        )}
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
              <a
                href={playlistDetails.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Spotify
              </a>
            )}
        </div>
      </div>
    );
  });
}

export default Playlists;
