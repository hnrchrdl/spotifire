import request, { serialize } from './requestService';

class PlaylistService {
  constructor(req) {
    this.request = request(req);
  }

  getAvailable() {
    return this.request.get('playlist/available').then(serialize);
  }
}

export default PlaylistService;
