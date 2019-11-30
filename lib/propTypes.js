import types from 'prop-types';

const customPropTypes = {
  user: types.shape({
    id: types.string,
  }).isRequired,
  selection: types.arrayOf(
    types.shape({
      id: types.string,
      display: types.string,
      imageUrl: types.string,
      type: types.string,
    }),
  ).isRequired,
  genres: types.arrayOf(
    types.shape({
      id: types.string,
      display: types.string,
    }),
  ).isRequired,
  artists: types.arrayOf(
    types.shape({
      id: types.string,
      display: types.string,
      imageUrl: types.string,
    }),
  ).isRequired,
  tracks: types.arrayOf(
    types.shape({
      id: types.string,
      display: types.string,
      imageUrl: types.string,
    }),
  ).isRequired,
  fetchGenres: types.func.isRequired,
  fetchTopArtists: types.func.isRequired,
  fetchTopTracks: types.func.isRequired,
  fetchRecommendations: types.func.isRequired,
  randomizeGenres: types.func.isRequired,
  randomizeArtists: types.func.isRequired,
  randomizeTracks: types.func.isRequired,
  selectItem: types.func.isRequired,
  removeItem: types.func.isRequired,
  savePlaylist: types.func.isRequired,
  recommendedTracks: types.arrayOf(
    types.shape({
      artists: types.arrayOf(
        types.shape({
          id: types.string,
          name: types.string,
        }),
      ),
      name: types.string,
    }),
  ).isRequired,
  setOption: types.func.isRequired,
};
export default customPropTypes;
