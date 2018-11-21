const functions = require('firebase-functions');






// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });



const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser')


// Automatically allow cross-origin requests
app.use(cors({
    origin: true
}));

// Add middleware to authenticate requests
//app.use(myMiddleware);


const admin = require('firebase-admin');


//   const firestore = new Firestore();
//   const settings = {/* your settings... */ timestampsInSnapshots: true};
//   firestore.settings(settings);

var serviceAccount = require('./keys/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
    timestampsInSnapshots: true
  
});


//  refrence to firestore db and pass it in to api controllers
app.firestoreDb = admin.firestore();


// print invokation details for trubleshooting
app.use('/', function (req, res, next) { // GET 'http://www.example.com/admin/new'
    console.log('req.originalUrl -->', req.originalUrl); // '/admin/new'
    console.log('req.baseUrl-->', req.baseUrl); // '/admin'
    console.log('req.path->', req.path); // '/new'
    console.log('req.method -->', req.method); // '/GET'
    next();
})
// });
app.use(bodyParser.json({
    strict: false
}));

require('./app/routes.js')(app);

app.get('/', (req, res) => res.json({
    message: "api server ok. please invoke a vlaid route"
}));

const vyasaApis = functions.https.onRequest(app)

module.exports = {
    vyasaApis
}


// // Expose Express API as a single Cloud Function:
// exports.vyasaapis = functions.https.onRequest(app);






// exports.quotes = functions.https.onRequest((request, response) => {
//     //response.send("Hello from Firebase!");

//     console.log("firebase function invoked", request.query, request.headers);

//     let myResponse = {
//         "_total": 1,
//         "values": [{
//             "id": 1,
//             "greeting": "Good morning!",
//             "message": "Arjuna, I will now enumerate the marks of the devotee I most dearly love. I love the one who harbors no ill will toward any living being, who returns love for hatred, who is friendly and compassionate toward all. I love the devotee who is beyond ‘I’ or 'mine,’ unperturbed by pain and not elated by pleasure, who possesses firm faith, is forgiving, ever contended and ever meditating on Me.",
//             "author": "Krishna",
//             "source": "Bhagavad Gita, Chapter 12, Verse 13-14",
//             "cycle": "morning"
//         }]
//     }


//     response.json(myResponse)

// }