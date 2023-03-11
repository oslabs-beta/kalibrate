import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import React from 'react';
import {chartJSdataset} from '../../types';
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
import options from '../../util/line-graph-options';
import palette from '../../util/initializeDatasets.tsx';
// filter for connected cluster? maybe even when passing props?

const TopicThroughput = props => {
  const {timeSeriesData, connectedCluster} = props;
  console.log(connectedCluster);

  // todo:
  // initialize on load
  // include in initializaton render of unrendered data
  // catch early-load issue
  // modify xscope?
  // MAKE GROUPS ONE
  // situation in site
  // ISR?

  const [topicDataSets, setTopicDatasets] = useState<chartJSdataset[]>([]);
  const [xSeries, setXSeries] = useState<string[]>([]);
  const [xScope, setxScope] = useState<number>(10);

  // create labels array and one chartJS dataset object per topic
  const initializeDatasets = () => {
    console.log('initializing');
    const blankArray = new Array(xScope);
    blankArray.fill('');
    setXSeries(blankArray);
    const newDataSets: chartJSdataset[] = [];
    for (const el in timeSeriesData[0].topicOffsets) {
      const newDataSet = makeTopicDataSet(el);
      newDataSet.data.length = xScope;
      newDataSet.data.fill(0);
      newDataSets.push(newDataSet);
    }
    setTopicDatasets(newDataSets);
  };

  let colorIndex: number = 0;
  const makeTopicDataSet = (topic: string) => {
    console.log('making topic');
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
    console.log('tds: ', topicDataSets);
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
          (current.topicOffsets[el] - previous.topicOffsets[el]) /
          ((current.time - previous.time) / 1000);
        if (el === set.label) set.data.push(msgPerSec);
        if (set.data.length > xScope) set.data.shift();
      }
      // if (newData.hasOwnProperty(el)) {
      //   newData[el].push(current.topicOffsets[el] - previous.topicOffsets[el]);
      //   // adjust data to fit desired amount of most recent data pts on graph
      //   if (newData[el].length > xScope) newData[el].shift();
      // } else {
      //   newData[el] = [];
      // }
    }
    console.log('setting tds');
    setTopicDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // add x-axis size to state??

  const data = {
    labels: xSeries, // x-axis labels are timestamps from state
    datasets: topicDataSets,
    options,
  };

  data.options.scales.y.title.text = 'Messages/sec';

  return <Line options={options} data={data} />;
};

export default TopicThroughput;
