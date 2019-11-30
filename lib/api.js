import axios from 'axios';

const API_BASE_URL = '/api/v1/';

export function getGenres() {
  return axios.get(`${API_BASE_URL}genres`);
}

export function getTopArtists() {
  return axios.get(`${API_BASE_URL}topArtists`);
}
export function getTopTracks() {
  return axios.get(`${API_BASE_URL}topTracks`);
}
export function getRecommendations(options) {
  return axios.post(`${API_BASE_URL}recommendations`, options);
}
export function savePlaylist(playlistData) {
  return axios.post(`${API_BASE_URL}savePlaylist`, playlistData);
}
