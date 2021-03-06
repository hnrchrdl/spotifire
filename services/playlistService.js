import request, { serialize } from "./requestService";

class PlaylistService {
  constructor(req) {
    this.request = request(req);
  }

  getAvailable() {
    return this.request.get("playlist/available").then(serialize);
  }

  upsertPlaylist(id, user) {
    return this.request.post(`playlist/upsert/${id}`, { user }).then(serialize);
  }

  removePlaylist(id, user) {
    return this.request.post(`playlist/remove/${id}`, { user }).then(serialize);
  }
}

export default PlaylistService;
