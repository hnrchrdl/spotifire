import request, { serialize } from './requestService';

class PlaylistService {
  constructor(req) {
    this.request = request(req);
  }

  getAvailable() {
    return this.request.get('playlist/available').then(serialize);
  }

  static togglePlaylist = (playlists = [], id) => (playlists.includes(id)
    ? playlists.filter(playlistId => playlistId !== id)
    : [...playlists, id]);
}

export default PlaylistService;
