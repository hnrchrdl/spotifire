import request, { serialize } from './requestService';

class UserService {
  constructor(req) {
    this.request = request(req);
  }

  static toggleSubscription = (subscriptions = {}, id) => {
    if (subscriptions[id]) {
      const { [id]: x, ...other } = subscriptions;
      return other;
    }
    return {
      ...subscriptions,
      [id]: {},
    };
  };

  getMe() {
    return this.request.get('me').then(serialize);
  }

  setMe(data) {
    return this.request.post('me', data).then(serialize);
  }

  toggleSubscription(id) {
    return this.getMe().then(({ subscriptions = {} }) => this.setMe({
      subscriptions: UserService.toggleSubscription(subscriptions, id),
    }));
  }
}

export default UserService;
