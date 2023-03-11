const options: {} = {
  scales: {
    y: {
      display: true,
      title: {
        display: true,
        text: 'Messages/sec',
      },
      min: 0,
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

export default options;
