const admin = require("firebase-admin");
const flights = require('./dealscroller-7bd62-export.json')
const serviceAccount = require("./dealscroller-7bd62-firebase-adminsdk-gewlm-bccce09d20.json");
const {deleteCollection} = require('./Delete_Data');
const { exporter } = require('./Export_Data')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dealscroller-7bd62.firebaseio.com"
});

const db = admin.firestore();
const docRef = db.collection('LatestFlightDetails');

console.log("Deleting Data fron Database");

deleteCollection(db, 'LatestFlightDetails', 500 )
.then((res)=>{
  console.log("Documents Deleted Successfully, Exporters are up and running.");
  exporter(flights["cheapest_flights"], docRef );
})
.catch((rej)=>{
  console.log("Documents Delete Unsuccessful, please rerun script or contact support.");
})





