

// vyasa apis controlllr
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
                .limit(1)
            quoteRef.get().
            then(quoteQS => {
                let myResponse = quoteQS.docs[0].data();
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