import * as moment from 'moment';
import BuildingSelector from './components/BuildingSelector';
import SensorsChart from './components/SensorsChart';
import EventsList from './components/EventsList';
import DialogShower from './components/DialogShower';
import Firebase from './firebase/Firebase';


let config = {
  apiKey: "AIzaSyAlXk-lVeGKe9574UulbNZz6iZC5jm_TZI",
  authDomain: "humidity-monitoring-system.firebaseapp.com",
  databaseURL: "https://humidity-monitoring-system.firebaseio.com",
  projectId: "humidity-monitoring-system",
  storageBucket: "humidity-monitoring-system.appspot.com",
  messagingSenderId: "516055515099"
};

try {
  let firebase = new Firebase();
  let app = firebase.app;
  let features = ['auth', 'database', 'messaging', 'storage', 'firestore'].filter(feature => typeof app[feature] === 'function');
  document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;

  console.log(app)

  let db = firebase.getDB();
  // db.collection('buildings').doc('cappella-borgoricco').collection('measurements').add({
  //   roomId: 'room0',
  //   sensorId: 'sensor0',
  //   timestamp: moment().toDate(),
  //   humidity: 67.8,
  //   temperature: 15,
  // })
} catch (e) {
  console.error(e);
  document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
}

const buildings = ['CappellaBorgoricco', 'MichelangeloCadoneghe'];
const defaultBuilding = 0;

const buildingSelector = new BuildingSelector('#building-selector');
buildingSelector.addOptions(buildings, defaultBuilding);

let sensorsChartHumidity = new SensorsChart('sensors-chart-humidity', buildings[defaultBuilding], 'humidity');
let sensorsChartTemperature = new SensorsChart('sensors-chart-temperature', buildings[defaultBuilding], 'temperature');
buildingSelector.addChangeListener((event) => {
  // event.detail is the actual MDCSelect object
  sensorsChartHumidity = new SensorsChart('sensors-chart-humidity', buildings[event.detail.selectedIndex], 'humidity');
  sensorsChartTemperature = new SensorsChart('sensors-chart-temperature', buildings[event.detail.selectedIndex], 'temperature');
});

const eventsList = new EventsList('#events-list');
// just to illustrare the use of momentjs
eventsList.appendItem('warning', 'Humidity under 60%', moment().format('MMMM Do YYYY, h:mm'))
eventsList.appendItem('warning', 'Humidity under 60%', moment().subtract(10, 'days').format('MMMM Do YYYY, h:mm'))