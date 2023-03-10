import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import React from 'react';
import {throughputData} from '../../types';
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

// filter for connected cluster? maybe even when passing props?

const TopicThroughput = props => {
  const {timeSeriesData, connectedCluster} = props;
  console.log(connectedCluster);
  console.log('TSD: ', timeSeriesData);

  const [topicThroughputData, setTopicThroughPutData] = useState<throughputData>({});
  const [xSeries, setXSeries] = useState<number[]>([]);

  // on mount, create topic arrays in throughput data object
  useEffect(() => {
    const newTopicObj = {};
    for (const el in timeSeriesData[0].topicOffsets) {
      newTopicObj[el] = [];
      setTopicThroughPutData(newTopicObj);
      console.log('set throughput data obj: ', newTopicObj);
    }
  }, []);

  // when new data is received, new data to topic arrays in throughput data object
  useEffect(() => {
    console.log(topicThroughputData);
    // need at least two data point to calculate rate of messages
    if (timeSeriesData.length <= 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];
    const previous = timeSeriesData[timeSeriesData.length - 2];
    // add time to x-axis data
    const newTime = [...xSeries];
    newTime.push(current.time);
    setXSeries(newTime);
    // copy throughput data object to change before updating state
    const newData = JSON.parse(JSON.stringify(topicThroughputData));
    for (const el in current.topicOffsets) {
      // push y-axis data to the appropriate array and update state
      if (newData.hasOwnProperty(el)) {
        newData[el].push(current.topicOffsets[el] - previous.topicOffsets[el]);
      } else {
        newData[el] = [];
      }
    }
    setTopicThroughPutData(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: topicThroughputData['unfulfilled'],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      // {
      //   label: 'Dataset 2',
      //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
    ],
  };

  return <Line options={options} data={data} />;
};

export default TopicThroughput;
