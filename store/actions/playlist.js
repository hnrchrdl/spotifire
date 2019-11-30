import { savePlaylist } from '../../lib/api';

// eslint-disable-next-line import/prefer-default-export
export const asyncActions = {
  savePlaylist: options => () => savePlaylist(options),
};
