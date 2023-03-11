const options: {} = {
  scales: {
    yAxes: [
      {
        id: 'messages/sec',
      },
    ],
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
