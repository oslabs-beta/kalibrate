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
import lineGraphOptions from '../../util/line-graph-options';
import initializeDatasets from '../../util/initializeDatasets';
import makeDataSet from '../../util/makeDataSet';

// filter for connected cluster? maybe even when passing props?

const TopicThroughput = props => {
  console.log('rendering topic throughput');
  const {timeSeriesData, connectedCluster} = props;

  // todo:
  // initialize on load
  // include in initializaton render of unrendered data
  // catch early-load issue
  // modify xscope?
  // situation in site
  // ISR?

  const [topicDataSets, setTopicDatasets] = useState<chartJSdataset[]>([]);
  const [xSeries, setXSeries] = useState<string[]>([]);
  const [xScope, setxScope] = useState<number>(10);

  // when new data is received, new data to topic arrays in throughput data object
  useEffect(() => {
    // need at least two data point to calculate rate of messages
    if (timeSeriesData.length <= 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];
    const {topicThroughputs} = current;
    // add time to x-axis data
    const newTime = [...xSeries];
    const time = new Date(current.time).toLocaleTimeString();
    newTime.push(time);
    if (newTime.length > xScope) newTime.shift();
    setXSeries(newTime);
    const newData: chartJSdataset[] = JSON.parse(JSON.stringify(topicDataSets));
    // copy throughput data object to change before updating state
    if (topicDataSets.length === 0) {
      initializeDatasets(
        timeSeriesData[0].topicOffsets,
        xScope,
        setXSeries,
        makeDataSet,
        setTopicDatasets
      );

      // const newGraphOptions = Object.assign({}, graphOptions);
      // newGraphOptions.plugins.title.text = 'Throughput by Topic';
      // newGraphOptions.scales.y.title.text = 'Messages/sec';
      // setGraphOptions(newGraphOptions);
      return;
    }
    for (const el in topicThroughputs) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        if (el === set.label) set.data.push(topicThroughputs[el]);
        if (set.data.length > xScope) set.data.shift();
      }
    }
    setTopicDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // add x-axis size to state??

  const data = {
    labels: xSeries, // x-axis labels are timestamps from state
    datasets: topicDataSets,
    options: {...lineGraphOptions},
  };
  // without this shallow copy, titles and labels of the two line graphs get buggy

  data.options.plugins.title.text = 'Throughput by Topic Group';
  data.options.scales.y.title.text = 'Messages/sec';

  return <Line options={data.options} data={data} />;
};

export default TopicThroughput;
