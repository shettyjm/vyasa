const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.quotes = functions.https.onRequest((request, response) => {
    //response.send("Hello from Firebase!");

    console.log("firebase function invoked",request.query,request.headers);

    let myResponse = {
        _total: 1,
        values: [
            {
                quote: "quote goes here"
            }
        ]
    }

    response.json(myResponse)


});




