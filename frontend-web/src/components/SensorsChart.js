import Highcharts from 'highcharts';

class SensorsChart {
  constructor(selector, buildingId, metric) {
    this.chart = Highcharts.chart(selector, {
      chart: {
        defaultSeriesType: 'spline'
      },
      title: {
        text: `${metric} measurements of bulding ${buildingId}`,
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxZoom: 20 * 1000,
        title: {
          text: 'time'
        }
      },
      yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
          text: metric
        }
      }
    });
  }
}

export default SensorsChart;