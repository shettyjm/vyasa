// vyasa apis controlllr
const iosPushNotificationProvider = require("../utils/iosNotificationProvider");
const vyasaServicesController = {

    // query for quotes data from db
    retrieveQuotes: function (req, res, db) {

        console.log(`retrieve quotes request with headers ${JSON.stringify(req.headers)}`)
        // get calling user tz specific schedule

        const userTz = req.headers['devicetimezone']

        getSchdule(userTz).then(function (schedule) {


            console.log(`schedule ${JSON.stringify(schedule)}. userTz :  ${userTz}`)

            //if scheduel cycle is morning, query morning cycle data
            // else if afternoon, query afternoon cylce data
            // else evening , evneing cycle data
            // query for all the records from db and send it back.
            const quoteRef = db.collection("quotes")
            // .where("deviceId", "==", req.query.deviceId)
            //     .limit(1)
            quoteRef.get().
            then(quoteQS => {
                let myResponse = [quoteQS.docs[0].data()];
                console.log(`data from firestore db ${myResponse}`)
                res.json(myResponse)
            })


        }).catch(err => {
            console.log('Error getting document', err);
            res.json(err)
        });


    },

    // create new quotes data in db
    createQuote: function (req, res, db) {
        console.log(`new quote create requested with payload ${JSON.stringify(req.body)}`)
        const now = new Date();
        var addQuote = db.collection('quotes').add({
            "schedule": req.body.schedule,
            "cycle": req.body.cycle,
            "greeting": req.body.greeting,
            "source": req.body.source,
            "message": req.body.message,
            "author": req.body.author,
            "createdOn": now
        }).then(ref => {
            console.log('Added anew quote document with ID: ', ref.id);
            ref.get()
                .then(doc => {
                    if (!doc.exists) {
                        console.log('after creating  new quote. No such document!');
                    } else {

                        let myResponse = doc.data();
                        console.log('Newly created quote Document data:', myResponse);
                        res.json(myResponse)
                    }



                })
                .catch(err => {
                    console.log('Error getting document', err);
                });
        }).catch(err => {
            console.log('Error getting document', err);
            res.json(err)
        });


        // console.log(`new quote create request with payload ${JSON.stringify(req.body)}`)
        // let myResponse = {
        //     "_total": 1,
        //     "values": [{
        //         "id": 1,
        //         "greeting": "Good morning!",
        //         "message": "Arjuna, I will now enumerate the marks of the devotee I most dearly love. I love the one who harbors no ill will toward any living being, who returns love for hatred, who is friendly and compassionate toward all. I love the devotee who is beyond ‘I’ or 'mine,’ unperturbed by pain and not elated by pleasure, who possesses firm faith, is forgiving, ever contended and ever meditating on Me.",
        //         "author": "Krishna",
        //         "source": "Bhagavad Gita, Chapter 12, Verse 13-14",
        //         "cycle": "morning"
        //     }]
        // }


        // res.json(myResponse)


    },

    // notify through  push noification about a new cycle quote.

    notifyNewCycleQuote: function (req, res, db) {

        let notifyRunResponse = {
            status: 'OK',
            message: `notication run at ${new Date()}`
        }


        // daily  notification logic

        // step1 1. Get all the zones from 

        const vyasaZoneRef = db.collection("vyasatimezones")
        vyasaZoneRef.get().
        then(vyasaZonesQS => {
            let myResponse = [vyasaZonesQS.docs[0].data()];
            console.log(`data from firestore db ${JSON.stringify(myResponse)}`)

            // how to convert firestore db timestamp into a jabascript date object.
            myResponse[0].notified.morning.when = myResponse[0].notified.morning.when.toDate();
            //  console.log(whenMorning)


            //step 2 loop through all records from vyasaZonesQS .._.foreach...

            // step 3  check if now (current moment) is in the current loop item mornnig
            // Eg. if current loop item is Los_Angsles time zone and now is equal to morning time in this time zone
            // if there are no push notification sent for today end

            // eg.. if (moment_now_date != current_zone_loop_item. notified.morning.when)

            // then moring notification for this timezone not happended today.
            // query the database.collection("users") for all users matching this.timeze
            // e.g if the current_timezone is los_Angeles , query db.collection("users") where zone='los_angeles"
            // send notification to all those matching users
            // update current_zone_loop_item. notified.morning.when = now() value

            // continue the innner loop for all users, external loop for all zones.


            // when a zone specific user with device id is ready in the loop
            let messagePayload = {
                title: "TODO :sample title text goes here.",
                message: "TODO : sample message text goes here"
            }

            let deviceId = "need to get this from users collection on db" // current user in the loop iteration deviceId;


            sendPushNotification(messagePayload, deviceId)
                .then((pushOutResponse) => {


                  //  console.log('pushOutResponse',pushOutResponse)
                    res.json(myResponse)

                }).catch((error) => {
                   // console.log('pushOutResponse',error)
                    
                    res.json(myResponse)

                })

          
        })


        //  res.json(notifyRunResponse)
    }

}
module.exports = vyasaServicesController;
// vyasa apis functions

// use moment & moment-timezone  js libraries to decide if now is morning,afternoon or eveing in user/callers timezone

function getSchdule(tz) {

    return new Promise((resolve, reject) => {


        //if now == tz morning

        let scheduleResp = {
            date: "2018-12-25",
            cycle: "morning"
        }
        resolve(scheduleResp)

    })

}


function sendPushNotification(payload, deviceId) {

    console.log("Jag will implement the logic here to send out the push notification")

    return new Promise((resolve, reject) => {


        let pushpayload = {
            deviceId: deviceId,
            title: payload.title,
            messageText: payload.message,
            type: " Sample type goes here"
        }

        iosPushNotificationProvider
            .publishIOSNotification(pushpayload)
            .then((success) => {
                console.log("PushNotificationProvider sucess/completed")
                resolve(1)

            }).catch((error) => {
                console.log("PushNotificationProvider errored/completed")
               
                reject(0)
            })

    })
}