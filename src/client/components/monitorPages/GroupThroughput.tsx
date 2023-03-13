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

const GroupThroughput = props => {
  const {timeSeriesData, connectedCluster, groupDatasets, setGroupDatasets, xSeries, setXSeries} =
    props;
  console.log('rendering group throughput w/groupdatsets: ', groupDatasets);

  const [xScope, setxScope] = useState<number>(10);

  // when new data is received, new data to group arrays in throughput data object
  useEffect(() => {
    console.log('grp thrupt 1', groupDatasets);
    // the keys for offsets and throughputs are identical, but offsets are ready one poll sooner, since throughputs require two data points to calculate
    // use offset data to initialize here on the initial poll so that throughput data have somewhere to land
    const newDatasets = initializeDatasets(timeSeriesData, 'groupOffsets', xScope, setXSeries);
    // fill initialized dataset with up to xScope columns of data, if available
    const timeArray = [...xSeries];
    console.log(timeArray);
    let i = timeSeriesData.length >= xScope ? timeSeriesData - xScope : 0;
    for (i; i < timeSeriesData.length; i++) {
      timeArray.push(timeSeriesData[i].time);
      for (const el of newDatasets) {
        for (const t in timeSeriesData[i].groupThroughputs) {
          if (t === el.label) {
            el.data.push(timeSeriesData[i].groupThroughputs[t]);
          }
        }
      }
    }
    console.log('newdatasets 2', newDatasets);
    setGroupDatasets(newDatasets);
  }, []);

  useEffect(() => {
    console.log('grp thrupt 2', groupDatasets);

    // need at least two data point to calculate rate of messages
    if (timeSeriesData.length <= 1 || groupDatasets.length < 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];
    const {groupThroughputs} = current;
    // add time to x-axis data
    const newTime = [...xSeries];
    const time = new Date(current.time).toLocaleTimeString();
    newTime.push(time);
    if (newTime.length > xScope) newTime.shift();
    setXSeries(newTime);
    // copy throughput data object to change before updating state
    const newData: chartJSdataset[] = JSON.parse(JSON.stringify(groupDatasets));

    for (const el in groupThroughputs) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        if (el === set.label) set.data.push(groupThroughputs[el]);
        if (set.data.length > xScope) set.data.shift();
      }
    }
    console.log('setting gds in grup useefect 2', groupDatasets);
    setGroupDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // add x-axis size to state??

  const data = {
    labels: xSeries, // x-axis labels are timestamps from state
    datasets: groupDatasets,
    options: JSON.parse(JSON.stringify(lineGraphOptions)), // copy options object to make local changes
  };

  data.options.plugins.title.text = 'Throughput by Consumer Group';
  data.options.scales.y.title.text = 'Messages/sec';
  data.options.scales.x.ticks.count = xScope;

  return <Line options={data.options} data={data} />;
};

export default GroupThroughput;
