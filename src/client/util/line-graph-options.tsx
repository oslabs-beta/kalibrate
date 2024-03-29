const lineGraphOptions: {} = {
  // increase for smoother curves
  lineTension: 0,
  scales: {
    y: {
      display: true,
      title: {
        display: true,
        text: '',
        font: {
          size: 18,
        },
      },
      min: 0,
    },
    x: {
      ticks: {},
    },
  },
  plugins: {
    title: {
      display: true,
      text: '',
      align: 'center',
      font: {
        size: 24,
      },
    },
  },
  transitions: {
    show: {
      animations: {
        x: {
          from: 0,
        },
        y: {
          from: 0,
        },
      },
    },
    hide: {
      animations: {
        x: {
          to: 0,
        },
        y: {
          to: 0,
        },
      },
    },
  },
};

export default lineGraphOptions;
