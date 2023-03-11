import {useEffect, useState} from 'react';
import {Radar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {chartJSradarProps} from '../../types';

const Replicas = props => {
  const {timeSeriesData, connectedCluster} = props;

  const defaultRadarProps: chartJSradarProps = {
    labels: [],
    datasets: [
      {
        label: '% replicas in sync by topic',
        backgroundColor: 'gray',
        borderColor: 'black',
        data: [],
      },
    ],
  };

  const [radarData, setRadarData] = useState<chartJSradarProps>(defaultRadarProps);

  // on receiving new data, update radar data in state
  // rebuild arrays each time since order of iteration through object keys of topicReplicaStatus is not guaranteed
  useEffect(() => {
    const newData = Object.assign({}, defaultRadarProps);
    const current = timeSeriesData[timeSeriesData.length - 1];
    for (const el in current.topicReplicaStatus) {
      newData.labels.push(el);
      newData.datasets[0].data.push(Math.round((current[el].isr / current[el].replicas) * 100));
    }
    setRadarData(newData);
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  const options = {
    scale: {
      ticks: {
        min: 0,
        max: 100,
        stepSize: 20,
      },
      gridLines: {
        circular: true,
      },
    },
  };

  const data = {};

  return <Radar options={options} data={radarData} />;
};

export default Replicas;
