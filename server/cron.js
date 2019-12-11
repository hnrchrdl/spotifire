const pick = require("lodash/pick");
const basicAuth = require("express-basic-auth");
const subscriptions = require("./subscriptions");
const spotify = require("./spotify");
const { setUser, getUsersBySubscription } = require("./firebase");

function updatePlaylist(user, subscription, subscriptionId) {
  return new Promise(async (resolve, reject) => {
    const userId = user.id;

    const connection = await spotify
      .getAuthenticatedConnection({
        userId,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresOn: user.expiresOn
      })
      .catch(e => {
        console.log(e);
        reject(e);
      });

    const tracks = await subscription.spotifire(connection).catch(e => {
      console.log(e);
      reject(e);
    });

    const playlistId = user.subscriptions[subscriptionId].playlistDetails.id;

    await connection
      .replaceTracksInPlaylist(
        playlistId,
        tracks.map(track => track.uri)
      )
      .catch(e => {
        console.log(e);
        reject(e);
      });

    const playlist = await connection.getPlaylist(playlistId).catch(e => {
      console.log(e);
      reject(e);
    });

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
    }).catch(e => {
      console.log(e);
      reject(e);
    });
    resolve();
  });
}

const cronJob = async (req, res) => {
  const { subscriptionId } = req.params;
  const subscription = subscriptions[subscriptionId];
  const usersSubscribed = await getUsersBySubscription(subscriptionId);
  const all = [];
  usersSubscribed.forEach(doc => {
    const data = doc.data();
    const user = {
      ...data,
      expiresOn: data.expiresOn.toDate()
    };
    all.push(updatePlaylist(user, subscription, subscriptionId));
  });
  await Promise.all(all).catch(e => {
    res.status(500).json(e);
  });
  res.status(201).end();
};

module.exports = server => {
  server.get(
    "/cron/:subscriptionId",
    basicAuth({
      users: {
        [process.env.CRON_USER]: process.env.CRON_PW
      }
    }),
    cronJob
  );
};
