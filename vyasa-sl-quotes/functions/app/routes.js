const apiServiceProvider = require('./controller/vysaCtlr')

module.exports = function (app) {

    const db = app.firestoreDb;
    

    app.get('/quotes', function (req, res) {

        console.log("vysa api get quotes invoked")
        apiServiceProvider.retrieveQuotes(req, res, db)
    })

    app.get('/notify', function (req, res) {

        console.log("vysa api get notify invoked")
        apiServiceProvider.notifyNewCycleQuote(req, res, db)
    })



    app.post('/quotes', function (req, res) {

        console.log("vysa api post quotes invoked")
        apiServiceProvider.createQuote(req, res,db)
    })


}