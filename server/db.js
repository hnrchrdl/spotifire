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

exports.getUser = id => db.collection('users').doc(id);

exports.setUser = (user) => {
  const userDocRef = db.collection('users').doc(user.id);
  userDocRef.set(user, { merge: true });
  return userDocRef;
};

exports.toJson = doc => doc.get().then(snapshot => snapshot.data());
