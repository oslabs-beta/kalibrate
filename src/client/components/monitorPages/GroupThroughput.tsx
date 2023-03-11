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
import initializeDatasets from '../../util/initializeDatasets';
import makeDataSet from '../../util/makeDataSet';

// filter for connected cluster? maybe even when passing props?

const GroupThroughput = props => {
  const {timeSeriesData, connectedCluster} = props;
  console.log('rendering group throughput');

  const [groupDataSets, setGroupDatasets] = useState<chartJSdataset[]>([]);
  const [xSeries, setXSeries] = useState<string[]>([]);
  const [xScope, setxScope] = useState<number>(10);

  // when new data is received, new data to group arrays in throughput data object
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
    const newData: chartJSdataset[] = JSON.parse(JSON.stringify(groupDataSets));
    if (groupDataSets.length === 0) {
      // create labels array and one chartJS dataset object per group
      initializeDatasets(
        timeSeriesData[0].groupOffsets,
        xScope,
        setXSeries,
        makeDataSet,
        setGroupDatasets
      );
      return;
    }
    for (const el in current.groupOffsets) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        const msgPerSec: number =
          (current.groupOffsets[el] - previous.groupOffsets[el]) /
          ((current.time - previous.time) / 1000);
        if (el === set.label) set.data.push(msgPerSec);
        if (set.data.length > xScope) set.data.shift();
      }
    }
    setGroupDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // add x-axis size to state??

  const data = {
    labels: xSeries, // x-axis labels are timestamps from state
    datasets: groupDataSets,
    options,
  };

  data.options.plugins.title.text = 'Throughput by Consumer Group';
  data.options.scales.y.title.text = 'Messages/sec';

  return <Line options={options} data={data} />;
};

export default GroupThroughput;
