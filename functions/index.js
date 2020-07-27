const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.storePost = functions.https.onRequest((request, response) => {
    cors((request, response) => {
        admin.database.ref('posts')
        .push(request.body)
        .then(() => response.send(201, { message: request.body.id }))
        .catch((err) => response.send(500, err))
    });
});
