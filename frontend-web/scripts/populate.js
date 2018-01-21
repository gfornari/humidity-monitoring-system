/**
 * Populate the Firestore instance with some consistent data.
 *
 * Humidity and
 * temperature may vary a lot thus without following something meaningful. The
 * timestamps are computed considering one measurement per minute from now minus
 * the number of minutes equal to the number of measurments.
 *
 * The uppercase variables can be used to configure the population.
 */

// can be either a string array or a number
let BUILDINGS = [
  'cappellaborgoricco',
  'oratoriocadoneghe',
];
// let ROOMS = 4;
let SENSORS = 4;
let MEASUREMENTS = 10;


const moment = require('moment');
const firebase = require('firebase');
require('@firebase/firestore');

/**
 * Returns a random number between min (inclusive) and max (exclusive) rounded
 * to 2 decimals.
 */
function getRandomFloat2(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

const config = {
  apiKey: "AIzaSyAlXk-lVeGKe9574UulbNZz6iZC5jm_TZI",
  authDomain: "humidity-monitoring-system.firebaseapp.com",
  databaseURL: "https://humidity-monitoring-system.firebaseio.com",
  projectId: "humidity-monitoring-system",
};

firebase.initializeApp(config);
const db = firebase.firestore();

console.log(`Going to add ${MEASUREMENTS * SENSORS} total measurements ...`);

if (!Array.isArray(BUILDINGS)) {
  // creates a [0,1,...,BUILDINGS] array
  BUILDINGS = [...new Array(BUILDINGS)].map(Number.call, Number);
}

let firstTimestap = moment().subtract(MEASUREMENTS, 'minutes');

for (const b of BUILDINGS) {
  console.log(`Adding measurements for building ${b}`);
  let buildingRef = db.collection('buildings').doc(b);
  for (let m = 0; m < MEASUREMENTS; m++) {
    for (let s = 0; s < SENSORS; s++) {
      buildingRef.collection('measurements').add({
        sensorId: s,
        humidity: getRandomFloat2(50, 80),
        temperature: getRandomFloat2(-10, 25),
        // we add s seconds to simulate the async measurement of each sensor
        timestamp: firstTimestap.add(m, 'minutes').add(s, 'seconds').toDate(),
      });
    }
    console.log(`${m * SENSORS} measurements added so far`);
  }
}

console.log(`Finish.`);

// goOffline seems to not working. Leaving it here anyway
firebase.database().goOffline();
