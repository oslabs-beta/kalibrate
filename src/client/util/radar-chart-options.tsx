const radarOptions: {} = {
  scales: {
    r: {
      title: {
        font: {
          size: 20,
        },
      },
      angleLines: {
        display: true,
      },
      pointLabels: {
        font: {
          size: 16,
        },
      },
      min: 0,
      max: 100,
      backgroundColor: 'rgba(255,200,0,1)',
      ticks: {
        font: {
          size: 14,
        },
        stepSize: 20,
        z: 1,
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        font: {
          size: 20,
        },
      },
    },
  },
  animate: false,
};

export default radarOptions;
