/**
 * Populate the Firestore instance with some consistent data.
 *
 * Humidity and temperature may vary a lot thus without following something
 * meaningful. The timestamps are computed considering one measurement per
 * minute from now minus the number of minutes equal to the number of
 * measurments.
 *
 * The uppercase variables can be used to configure the population. Make sure to
 * create the needed indexes as well.
 */

let BUILDINGS = [
  'cappellaborgoricco',
  'oratoriocadoneghe',
];
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

console.log(`Going to add ${BUILDINGS.length * MEASUREMENTS * SENSORS} total measurements ...`);

let firstTimestamp = moment().subtract(MEASUREMENTS, 'minutes').subtract(SENSORS, 'seconds');

for (const b of BUILDINGS) {
  console.log(`Adding measurements for building ${b}`);
  for (let m = 0; m < MEASUREMENTS; m++) {
    firstTimestamp.add(1, 'minutes');
    for (let s = 0; s < SENSORS; s++) {
      db.collection('measurements').add({
        buildingId: b,
        sensorId: s.toString(),
        humidity: getRandomFloat2(50, 80),
        temperature: getRandomFloat2(-10, 25),
        // we add s seconds to simulate the async measurement of each sensor
        // moment.add do side-effect
        timestamp: firstTimestamp.add(1, 'seconds').valueOf(),
      });
    }
    console.log(`${m * SENSORS} measurements added so far`);
  }
}

console.log(`Finish.`);

firebase.database().goOffline();
