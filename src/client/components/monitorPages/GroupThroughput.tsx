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

//verify that filtering of time series data by cluster works

const GroupThroughput = props => {
  const {timeSeriesData, groupDatasets, setGroupDatasets, xSeries, setXSeries} = props;
  console.log('rendering group throughput');

  const [xScope, setxScope] = useState<number>(10);

  useEffect(() => {
    console.log('FIRST USEEFFECT: TOPIC');
    const newDatasets = initializeDatasets(timeSeriesData, 'groupThroughputs', xScope, setXSeries);
    console.log('tsd length: ', timeSeriesData.length);
    console.log('tsd 0: ', timeSeriesData[0]);
    console.log('newdatasets: ', newDatasets);
    // fill initialized dataset with up to xScope columns of data, if available
    const timeArray = [...xSeries];
    let i = timeSeriesData.length >= xScope ? timeSeriesData - xScope : 0;
    for (i; i < timeSeriesData.length; i++) {
      timeArray.push(timeSeriesData[i].time);
      for (const el of newDatasets) {
        // console.log('el: ', el);
        for (const t in timeSeriesData[i].groupThroughputs) {
          // console.log(`t: ${t}, label: ${el.label}`);
          if (t === el.label) {
            // console.log('match: ', timeSeriesData[i].topicThroughputs[t]);
            el.data.push(timeSeriesData[i].groupThroughputs[t]);
            // console.log('data add: ', el.data);
          }
        }
      }
    }
    console.log('newdatasets 2 groups', newDatasets);
    setGroupDatasets(newDatasets);
  }, []);

  // when new data is received, new data to group arrays in throughput data object
  useEffect(() => {
    console.log('SECOND USEEFFECT: GROUP');

    // need at least two data point to calculate rate of messages
    if (timeSeriesData.length <= 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];
    const {groupThroughputs} = current;
    // add time to x-axis data
    const newTime = [...xSeries];
    const time = new Date(current.time).toLocaleTimeString();
    newTime.push(time);
    if (newTime.length > xScope) newTime.shift();
    setXSeries(newTime);
    console.log('gds: ', groupDatasets);
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
    setGroupDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData.at(-1)]);

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
