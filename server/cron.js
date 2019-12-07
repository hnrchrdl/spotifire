const subscriptions = require("./subscriptions");

const cronJob = (req, res) => {
  const { subscriptionId } = req.params;
  const subscription = subscriptions[subscriptionId];
  res.json(subscription);
};

module.exports = server => {
  // server.get(
  //   "/cron/:playlistId",
  //   basicAuth({
  //     users: {
  //       [process.env.CRON_USER]: process.env.CRON_PW
  //     }
  //   }),
  //   cronJob
  // );
  server.get("/cron/:subscriptionId", cronJob);
};
