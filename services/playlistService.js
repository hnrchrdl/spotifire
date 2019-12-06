import request, { serialize } from './requestService';

class PlaylistService {
  constructor(req) {
    this.request = request(req);
  }

  getAvailable() {
    return this.request.get('playlist/available').then(serialize);
  }

  upsertPlaylist(id) {
    return this.request.get(`playlist/upsert/${id}`).then(serialize);
  }

  removePlaylist(id) {
    // todo: remove playlist
    return null;
  }
}

export default PlaylistService;
