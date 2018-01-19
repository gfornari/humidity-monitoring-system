import Highcharts from 'highcharts';

class SensorsChart {
  constructor(buildingId) {
    this.chart = Highcharts.chart('sensors-chart', {
      chart: {
        defaultSeriesType: 'spline',
        // useful with live data
        events: {
            load: function() {
              const interval = 3000;
              const offset = interval / 2;
              setInterval(() => {
                this.series[0].addPoint(
                  [(new Date()).getTime(), Math.round(Math.random() * 1000) / 100],
                  true, true
                )
              }, interval);

              setTimeout(() => {
                setInterval(() => {
                  this.series[1].addPoint(
                    [(new Date()).getTime(), Math.round(Math.random() * 1000) / 100],
                    true, true
                  )
                }, interval);
              }, offset)
            }
        }
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
          (new Date()).getTime() - (9 - i) * 3000,
          Math.round(Math.random() * 1000) / 100
        ])
      }, {
        name: 'Sensor2',
        data: [...new Array(10)].map((v, i) => [
          (new Date()).getTime() - (9 - i) * 3000,
          Math.round(Math.random() * 1000) / 100
        ])
      }]
    });
  }
}

export default SensorsChart;