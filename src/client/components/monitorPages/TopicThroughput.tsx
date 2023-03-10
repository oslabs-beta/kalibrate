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
  const [xSeries, setXSeries] = useState<string[]>([]);
  const [xScope, setxScope] = useState<number>(10);

  // on mount, create topic arrays in throughput data object, and populate xSeries with empty strings
  useEffect(() => {
    const blankArray = new Array(xScope);
    blankArray.fill('');
    setXSeries(blankArray);
    const newTopicObj = {};
    for (const el in timeSeriesData[0].topicOffsets) {
      newTopicObj[el] = [];
      newTopicObj[el].length = xScope;
      newTopicObj[el].fill(null);
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
    const time = new Date(current.time).toLocaleTimeString();
    newTime.push(time);
    if (newTime.length > xScope) newTime.shift();
    setXSeries(newTime);
    // copy throughput data object to change before updating state
    const newData = JSON.parse(JSON.stringify(topicThroughputData));
    for (const el in current.topicOffsets) {
      // push y-axis data to the appropriate array and update state
      if (newData.hasOwnProperty(el)) {
        newData[el].push(current.topicOffsets[el] - previous.topicOffsets[el]);
        // adjust data to fit desired amount of most recent data pts on graph
        if (newData[el].length > xScope) newData[el].shift();
      } else {
        newData[el] = [];
      }
    }
    setTopicThroughPutData(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const labels = xSeries; // x-axis labels are timestamps from state

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Topic Offsets',
      },
    },
  };

  // add x-axis size to state??

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: topicThroughputData['payments'],
        spanGaps: true,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        hidden: false,
      },
      {
        label: 'Dataset 2',
        data: topicThroughputData['__consumer_offsets'],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        hidden: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default TopicThroughput;
