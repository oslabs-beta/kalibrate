import {useEffect, useState} from 'react';
import {Radar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import radarOptions from '../../util/radar-chart-options';
import {chartJSradarProps} from '../../types';

const Replicas = props => {
  const {timeSeriesData, connectedCluster} = props;

  const defaultRadarProps: chartJSradarProps = {
    labels: [],
    datasets: [
      {
        label: '% replicas in sync by topic',
        backgroundColor: 'rgba(34, 202, 236, 1)',
        borderColor: 'rgba(34, 150, 150, 1)',
        data: [],
      },
    ],
  };

  const [radarData, setRadarData] = useState<chartJSradarProps>(defaultRadarProps);

  // on receiving new data, update radar data in state
  useEffect(() => {
    if (timeSeriesData.length) {
      const newData = Object.assign({}, defaultRadarProps);
      const current = timeSeriesData.at(-1);
      for (const el in current.topicReplicaStatus) {
        newData.labels.push(el);
        newData.datasets[0].data.push(current.topicReplicaStatus[el]);
      }
      setRadarData(newData);
    }
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

  // global chart plugins - maybe move during refactoring

  return <Radar options={radarOptions} data={radarData} />;
};

export default Replicas;
