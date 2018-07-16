import * as moment from 'moment';
import BuildingSelector from './components/BuildingSelector';
import SensorsChart from './components/SensorsChart';
import EventsList from './components/EventsList';
import Firebase from './firebase/Firebase';

let db;

try {
  let firebase = new Firebase();
  let app = firebase.app;
  let features = ['auth', 'database', 'messaging', 'storage', 'firestore'].filter(feature => typeof app[feature] === 'function');
  console.log(`Firebase SDK loaded with ${features.join(', ')}`);
  db = firebase.getDB();
} catch (e) {
  console.error('Error loading the Firebase SDK');
  console.error(e);
}

const buildings = ['cappellaborgoricco', 'oratoriocadoneghe'];
const defaultBuilding = 0;

// change these values with consistent ones
const lowHumidityThreshold = 0;
const upHumidityThreshold  = 75;
const lowTemperatureThreshold = 244;
const upTemperatureThreshold  = 500;

const buildingSelector = new BuildingSelector('#building-selector');
buildingSelector.addOptions(buildings, defaultBuilding);

let sensorsChartHumidity = new SensorsChart('sensors-chart-humidity', buildings[defaultBuilding], 'humidity');
let sensorsChartTemperature = new SensorsChart('sensors-chart-temperature', buildings[defaultBuilding], 'temperature');
handleChartsData(buildings[defaultBuilding]);

let eventsList = new EventsList('#events-list');
// just to illustrare the use of momentjs
// eventsList.appendItem('warning', 'Humidity under 60%', moment().format('MMMM Do YYYY, h:mm'));
// eventsList.appendItem('warning', 'Humidity under 60%', moment().subtract(10, 'days').format('MMMM Do YYYY, h:mm'));

buildingSelector.addChangeListener(() => {
  // event.detail is the actual MDCSelect object
  sensorsChartHumidity = new SensorsChart('sensors-chart-humidity', buildings[buildingSelector.select.selectedIndex], 'humidity');
  sensorsChartTemperature = new SensorsChart('sensors-chart-temperature', buildings[buildingSelector.select.selectedIndex], 'temperature');

  eventsList.deleteAllEvents();
  eventsList = new EventsList('#events-list');
  handleChartsData(buildings[buildingSelector.select.selectedIndex]);
});


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

      // detecting critical events
      let humidityCriticalEvents = humiditySerie[sensorId].filter(detection =>
        detection[1] <= lowHumidityThreshold ||
        detection[1] >= upHumidityThreshold
      )

      let temperatureCriticalEvents = temperatureSerie[sensorId].filter(detection =>
        detection[1] <= lowTemperatureThreshold ||
        detection[1] >= upTemperatureThreshold
      )

      // adding critical events to the list
      humidityCriticalEvents.forEach(criticalEvent => {
        let lowHigh, lhThreshold;
        if (criticalEvent[1] >= upHumidityThreshold) {
          lowHigh = 'over';
          lhThreshold = upHumidityThreshold;
        } else {
          lowHigh = 'under';
          lhThreshold = lowHumidityThreshold;
        }

        const adjustedTime = adjustTime(new Date(criticalEvent[0]));

        eventsList.appendItem('warning', 'Humidity ' + lowHigh + ' ' + lhThreshold + ' detected by sensor ' + sensorId,
        new Date(criticalEvent[0]).toDateString() + ", "
        + adjustedTime[0] + ":"
        + adjustedTime[1] + ":"
        + adjustedTime[2]);
      });

      temperatureCriticalEvents.forEach(criticalEvent => {
        let lowHigh, lhThreshold;
        if (criticalEvent[1] >= upTemperatureThreshold) {
          lowHigh = 'over';
          lhThreshold = upTemperatureThreshold;
        } else {
          lowHigh = 'under';
          lhThreshold = lowTemperatureThreshold;
        }

        const adjustedTime = adjustTime(new Date(criticalEvent[0]));

        eventsList.appendItem('warning', 'Temperature ' + lowHigh + ' ' + lhThreshold + ' detected by sensor ' + sensorId,
        new Date(criticalEvent[0]).toDateString() + ", "
        + adjustedTime[0] + ":"
        + adjustedTime[1] + ":"
        + adjustedTime[2]);
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

  function adjustTime(date) {
    let hour = date.getHours() - 2;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    if (hour < 10)    hour = '0' + hour;
    if (minute < 10)  minute = '0' + minute;
    if (second < 10)  second = '0' + second;

    return [hour,minute,second]
  }
}
