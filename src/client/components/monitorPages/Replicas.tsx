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
import {chartJSdataset} from '../../types';

const Replicas = props => {
  const [radarData, setRadarData] = useState<chartJSdataset>(null);

  return <Radar options={options} data={data} />;
};

export default Replicas;
