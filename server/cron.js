const subscriptions = require("./subscriptions");

module.exports = server => {
  // server.get(
  //   "/cron/:playlistId",
  //   basicAuth({
  //     users: {
  //       [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD
  //     }
  //   }),
  //   Controller.cron
  // );
  server.get("/cron/:subscriptionId", (req, res) => {
    const { subscriptionId } = req.params;
    const subscription = subscriptions[subscriptionId];
    res.json(subscription);
  });
};
