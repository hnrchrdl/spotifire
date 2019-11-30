import { combineReducers } from 'redux';

import user from './user';
import genres from './genres';
import artists from './artists';
import tracks from './tracks';
import seeds from './seeds';
import recommendations from './recommendations';
import options from './options';

export default combineReducers({
  user,
  genres,
  artists,
  tracks,
  seeds,
  recommendations,
  options,
});
