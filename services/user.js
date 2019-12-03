import request, { serialize } from './requestService';

class UserService {
  constructor(req) {
    this.request = request(req);
  }

  getMe() {
    return this.request.get('me').then(serialize);
  }
}

export default UserService;
