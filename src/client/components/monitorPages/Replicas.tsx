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
        borderWidth: 5,
        data: [],
      },
    ],
  };

  const [radarData, setRadarData] = useState<chartJSradarProps>(defaultRadarProps);

  // on receiving new data, update radar data in state
  // rebuild arrays each time since order of iteration through object keys of topicReplicaStatus is not guaranteed
  useEffect(() => {
    if (timeSeriesData.length) {
      console.log('length! ', timeSeriesData);
      const newData = Object.assign({}, defaultRadarProps);
      const current = timeSeriesData[timeSeriesData.length - 1];
      console.log('c.trs ', current.topicReplicaStatus);
      console.log('keys: ', Object.keys(current.topicReplicaStatus));
      for (const el in current.topicReplicaStatus) {
        console.log('el ', el);
        console.log('c.el', current.topicReplicaStatus[el]);
        newData.labels.push(el);
        newData.datasets[0].data.push(
          Math.round(
            (current.topicReplicaStatus[el].isr / current.topicReplicaStatus[el].replicas) * 100
          )
        );
      }
      setRadarData(newData);
    }
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

  // global chart plugins - maybe move during refactoring

  return <Radar options={radarOptions} data={radarData} />;
};

export default Replicas;
