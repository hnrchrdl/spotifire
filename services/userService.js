import request, { serialize } from './requestService';
import PlaylistService from './playlistService';

class UserService {
  constructor(req) {
    this.request = request(req);
  }

  getMe() {
    return this.request.get('me').then(serialize);
  }

  setMe(data) {
    return this.request.post('me', data).then(serialize);
  }

  togglePlaylist(id) {
    return this.getMe().then(({ playlists = [] }) => this.setMe({
      playlists: PlaylistService.togglePlaylist(playlists, id),
    }));
  }
}

export default UserService;
