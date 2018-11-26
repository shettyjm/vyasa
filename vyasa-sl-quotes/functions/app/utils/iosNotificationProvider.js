const firebaseadmin = require('firebase-admin');


const serviceAccount = require('../../keys/serviceAccount.json');



let sampleDeviceToken = "";

// console.log("serviceAccount",JSON.stringify(serviceAccount))
//console.log("GOOGLE_SA_JSON -->",JSON.parse(serviceAccount))


if (firebaseadmin.apps.length === 0) {
    firebaseadmin.initializeApp({
        credential: firebaseadmin.credential.cert(serviceAccount),
        databaseURL: 'https://vyasa-10008.firebaseio.com',
        projectId: 'vyasa-10008'
    });
}

function notify(payload) {

    console.log(" push notification published notify payload =====>", payload)


    return new Promise((resolve, reject) => {
        firebaseadmin.messaging().sendToDevice(payload.registrationToken,
                payload.notificationPayload)
            .then(function (response) {
                // See the MessagingDevicesResponse reference documentation for
                // the contents of response.

                const parsedResp =  response.results[0];
             //   console.log("parsedResp",parsedResp)
                if (parsedResp.error) {
                    console.log('Message send failed. Error :', JSON.stringify(parsedResp.error));
                    reject(parsedResp.error)

                } else {
                    console.log('Successfully sent message with message id :', JSON.stringify(response.results[0]));
                    resolve(response)
   }
            })
            .catch(function (error) {
                console.log('Error sending message:', error);
                reject(error)
            });


    })


}


const iosPushnfManager = {


    publishIOSNotification: function (payload) {
        console.log("publishIOSNotification invoked");

        let messagePayload = {
            registrationToken: payload.deviceId,
            notificationPayload: {
                notification: {
                    title: payload.title,
                    body: payload.messageText,
                    message: "Do you need this one",
                    sound: 'default'
                },
                data: {
                    type: payload.type,
                     title: payload.title,
                    message: payload.messageText
                }
            }
        }


     //   console.log(messagePayload)
       

        return new Promise((resolve, reject) => {

            notify(messagePayload)
                .then((success) => {
                    // console.log("daily reminder notification message notificaion complete");

                   // console.log(" done with notifcatoin responding backc ....",success)
                    resolve(1)

                }).catch((error) => {

                    //  console.log("daily notification to an user errored out");
                    reject(0)

                });


        })

    }


}
module.exports = iosPushnfManager;