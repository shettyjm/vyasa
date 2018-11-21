const vyasaServicesController = {

    // query for quotes data from db
    retrieveQuotes: function (req, res, db) {

        console.log(`retrieve quotes request with headers ${JSON.stringify(req.headers)}`)


        // query for all the records from db and send it back.
        const quoteRef = db.collection("quotes")
            // .where("deviceId", "==", req.query.deviceId)
            .limit(1)
        quoteRef.get().
        then(quoteQS => {
            let myResponse = quoteQS.docs[0].data();
            console.log(`data from firestore db ${myResponse}`)
            res.json(myResponse)
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
        });;


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