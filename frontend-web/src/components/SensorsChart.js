import Highcharts from 'highcharts';

class SensorsChart {
  constructor(buildingId) {
    this.chart = Highcharts.chart('sensors-chart', {
      chart: {
        defaultSeriesType: 'spline',
        // useful with live data
        // events: {
        //     load: requestData
        // }
      },
      title: {
        text: `Sensors measurements of bulding ${buildingId}`,
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxZoom: 20 * 1000
      },
      yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
          text: 'Humidity',
          margin: 80
        }
      },
      series: [{
        name: 'Sensor1',
        // just a bad way to generate random data
        data: [...new Array(10)].map((v, i) => [
          (new Date()).getTime() + i * 10000,
          Math.round(Math.random() * 1000) / 100
        ])
      }, {
        name: 'Sensor2',
        data: [...new Array(10)].map((v, i) => [
          (new Date()).getTime() + i * 10000,
          Math.round(Math.random() * 1000) / 100
        ])
      }]
    });
  }
}

export default SensorsChart;