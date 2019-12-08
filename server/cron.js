const pick = require("lodash/pick");
const subscriptions = require("./subscriptions");
const spotify = require("./spotify");
const { setUser, getUsersBySubscription } = require("./firebase");

const cronJob = async (req, res) => {
  const { subscriptionId } = req.params;
  const subscription = subscriptions[subscriptionId];
  const usersSubscribed = await getUsersBySubscription(subscriptionId);
  usersSubscribed.forEach(async function(doc) {
    const user = doc.data();
    const userId = doc.id;
    const tracks = await subscription.spotifire({
      userId,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      expiresOn: user.expiresOn
    });

    const playlistId = user.subscriptions[subscriptionId].playlistDetails.id;

    const connection = await spotify
      .getAuthenticatedConnection({
        userId: user.id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresOn: user.expiresOn
      })
      .catch(e => console.log(e));

    await connection
      .replaceTracksInPlaylist(
        playlistId,
        tracks.map(track => track.uri)
      )
      .catch(e => console.log(e));

    const playlist = await connection
      .getPlaylist(playlistId)
      .catch(e => console.log(e));

    await setUser({
      id: user.id,
      subscriptions: {
        ...user.subscriptions,
        [subscriptionId]: {
          enabled: true,
          playlistDetails: pick(playlist.body, [
            "id",
            "href",
            "uri",
            "images",
            "name",
            "external_urls"
          ]),
          updatedOn: new Date()
        }
      }
    }).catch(e => console.log(e));
  });
  res.status(201).end();
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
