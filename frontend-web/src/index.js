import * as moment from 'moment';
import BuildingSelector from './components/BuildingSelector';
import SensorsChart from './components/SensorsChart';
import EventsList from './components/EventsList';
import DialogShower from './components/DialogShower';
import Firebase from './firebase/Firebase';

let db;

try {
  let firebase = new Firebase();
  let app = firebase.app;
  let features = ['auth', 'database', 'messaging', 'storage', 'firestore'].filter(feature => typeof app[feature] === 'function');
  document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
  db = firebase.getDB();
} catch (e) {
  console.error(e);
  document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
}

const buildings = ['cappellaborgoricco', 'oratoriocadoneghe'];
const defaultBuilding = 0;

const buildingSelector = new BuildingSelector('#building-selector');
buildingSelector.addOptions(buildings, defaultBuilding);

let sensorsChartHumidity = new SensorsChart('sensors-chart-humidity', buildings[defaultBuilding], 'humidity');
let sensorsChartTemperature = new SensorsChart('sensors-chart-temperature', buildings[defaultBuilding], 'temperature');
handleChartsData(buildings[defaultBuilding]);

buildingSelector.addChangeListener((event) => {
  // event.detail is the actual MDCSelect object
  sensorsChartHumidity = new SensorsChart('sensors-chart-humidity', buildings[event.detail.selectedIndex], 'humidity');
  sensorsChartTemperature = new SensorsChart('sensors-chart-temperature', buildings[event.detail.selectedIndex], 'temperature');

  handleChartsData(buildings[event.detail.selectedIndex]);
});

const eventsList = new EventsList('#events-list');
// just to illustrare the use of momentjs
eventsList.appendItem('warning', 'Humidity under 60%', moment().format('MMMM Do YYYY, h:mm'));
eventsList.appendItem('warning', 'Humidity under 60%', moment().subtract(10, 'days').format('MMMM Do YYYY, h:mm'));

// TODO damn ugly. Really, it should be improved.
function handleChartsData(buildingId) {
  db.getBuildingMeasurementsSince(buildingId, 7, 'days').then((qs) => {
    if (qs.empty) {
      console.log('No document retrieved');
      return;
    }

    let humiditySerie = {};
    let temperatureSerie = {};

    qs.forEach(doc => {
      let data = doc.data();

      if (!humiditySerie.hasOwnProperty(data.sensorId)) {
        humiditySerie[data.sensorId] = [];
      }

      if (!temperatureSerie.hasOwnProperty(data.sensorId)) {
        temperatureSerie[data.sensorId] = [];
      }

      humiditySerie[data.sensorId].push([ data.timestamp, data.humidity ]);
      temperatureSerie[data.sensorId].push([ data.timestamp, data.temperature ]);
    });

    // add humidity serie
    Object.keys(humiditySerie).forEach(sensorId => {
      sensorsChartHumidity.chart.addSeries({
        name: sensorId,
        data: humiditySerie[sensorId],
      });
    });

    // add temperature serie
    Object.keys(temperatureSerie).forEach(sensorId => {
      sensorsChartTemperature.chart.addSeries({
        name: sensorId,
        data: temperatureSerie[sensorId],
      });
    });

    // listen for new documents
    db.onNewSnapshots(buildingId, qs => {
      qs.docChanges.forEach(change => {
        let data = change.doc.data();
        sensorsChartHumidity.chart.series.find(el => el.name === data.sensorId).addPoint([ data.timestamp, data.humidity ]);
        sensorsChartTemperature.chart.series.find(el => el.name === data.sensorId).addPoint([ data.timestamp, data.temperature ]);
      });
    });
  }).catch(console.error);
}