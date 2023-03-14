import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {chartJSdataset, TopicThroughputProps} from '../../types';
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
import options from './line-graph-options';
import palette from './palette';

const TopicThroughput = (props: TopicThroughputProps) => {
  const {timeSeriesData, connectedCluster} = props;

  const [topicDataSets, setTopicDatasets] = useState<chartJSdataset[]>([]);
  const [xSeries, setXSeries] = useState<string[]>([]);
  const [xScope, setxScope] = useState<number>(10);

  // on mount, create labels array and one chartJS dataset object per topic
  const initializeDatasets = () => {
    const blankArray = new Array(xScope);
    blankArray.fill('');
    setXSeries(blankArray);
    const newDataSets: chartJSdataset[] = [];

    for (const el in timeSeriesData[0].topicOffsets) {
      const newDataSet = makeTopicDataSet(el);
      newDataSet.data.length = xScope;
      newDataSet.data.fill(null);
      newDataSets.push(newDataSet);
    }

    setTopicDatasets(newDataSets);
  };

  let colorIndex: number = 0;
  const makeTopicDataSet = (topic: string) => {
    const colorString: string = palette[colorIndex];
    colorIndex++;

    if (colorIndex == palette.length) colorIndex = 0;

    const newTopicObj: chartJSdataset = {
      label: topic,
      data: [],
      // return once converted to rbga to add .5 a to background color
      borderColor: colorString,
      backgroundColor: colorString,
      hidden: false,
    };

    return newTopicObj;
  };

  // when new data is received, new data to topic arrays in throughput data object
  useEffect(() => {
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
    const newData: chartJSdataset[] = JSON.parse(JSON.stringify(topicDataSets));

    if (topicDataSets.length === 0) {
      initializeDatasets();
      return;
    }

    for (const el in current.topicOffsets) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        const msgPerSec: number =
          // @ts-ignore
          (current.topicOffsets[el] - previous.topicOffsets[el]) /
          ((current.time - previous.time) / 1000);

        if (el === set.label) set.data.push(msgPerSec);
        if (set.data.length > xScope) set.data.shift();
      }
    }

    setTopicDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const data = {
    labels: xSeries, // x-axis labels are timestamps from state
    datasets: topicDataSets,
    options,
  };

  return <Line options={options} data={data} />;
};

export default TopicThroughput;
