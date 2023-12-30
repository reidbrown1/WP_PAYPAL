/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.purchaseCompleted = functions.https.onCall((data) => {
    const userID = data.userID;
    const amountPurchased = parseInt(data.amount, 10);

    console.log(userID);
    console.log(amountPurchased);

    var db = admin.firestore();
    var docRef = db.collection('users').doc(userID);

    return db.runTransaction((transaction) => {
        return transaction.get(docRef).then((doc) => {
            if (!doc.exists) {
                throw "Document does not exist!";
            }

            // Compute new amount of PoolCoins
            var newAmount = doc.data().PoolCoins + amountPurchased;

            // Update Firestore document
            transaction.update(docRef, { PoolCoins: newAmount });
        });
    });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
