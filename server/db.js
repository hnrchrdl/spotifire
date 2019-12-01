const admin = require('firebase-admin');

const firebaseProjectID = process.env.FIREBASE_PROJECT_ID;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;

admin.initializeApp({
  credential: admin.credential.cert({
    project_id: firebaseProjectID,
    private_key: firebasePrivateKey,
    client_email: firebaseClientEmail,
  }),
  databaseURL: 'https://spotifire-8f25c.firebaseio.com',
});
const db = admin.firestore();

exports.setUser = async (user) => {
  const docRef = db.collection('users').doc(user.id);
  await docRef.set(user, { merge: true });

  const doc = await docRef.get();
  return doc.data();
};

exports.getAvailablePlaylists = () => db.collection('playlists').get().then(
  collection => collection.docs.map(doc => ({ ...doc.data(), id: doc.id })),
);
