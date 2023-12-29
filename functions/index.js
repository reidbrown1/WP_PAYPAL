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
exports.purchaseCompleted = functions.https.onCall((data, context) => {
    // Get the order ID and intent from data
    // const orderId = data.orderId;
    // const intent = data.intent;
  
    // Update a variable in Firebase database
    var db = admin.firestore();
    var docRef = db.collection('users').doc('fg57TZhmLmWH9TT3WCA3WuXT7dy2');
    return docRef.update({
      PoolCoins: 100
    });
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
