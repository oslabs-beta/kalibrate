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
const TopicThroughput = props => {
  const {timeSeriesData, topicDatasets, setTopicDatasets, xSeries, setXSeries} = props;

  // todo:
  // initialize on load
  // include in initializaton render of unrendered data
  // catch early-load issue
  // modify xscope?
  const [xScope, setxScope] = useState<number>(10);
  //const [dataSetIsInitialized, setDataSetIsInitialized] = useState<boolean>(false);

  // on arrival, initialize datasets if not initialized
  useEffect(() => {
    console.log('FIRST USEEFFECT: TOPIC');
    console.log('tds: ', timeSeriesData);

    const newDataSets = initializeDatasets(timeSeriesData, 'topicThroughputs', xScope, setXSeries);
    console.log('nds:', newDataSets);
    // fill initialized dataset with up to xScope columns of data, if available
    const timeArray = [...xSeries];
    let i = timeSeriesData.length >= xScope ? timeSeriesData - xScope : 0;
    for (i; i < timeSeriesData.length; i++) {
      console.log('hello1?');

      timeArray.push(timeSeriesData[i].time);
      for (const el of newDataSets) {
        console.log('hello2?');
        console.log('el: ', el);
        for (const t in timeSeriesData[i].topicThroughputs) {
          console.log(`t: ${t}, label: ${el.label}`);
          if (t === el.label) {
            // console.log('match: ', timeSeriesData[i].topicThroughputs[t]);
            el.data.push(timeSeriesData[i].topicThroughputs[t]);
            // console.log('data add: ', el.data);
          }
        }
      }
    }
    console.log('newdatasets 2 topics', newDataSets);
    setTopicDatasets(newDataSets);
    //   timeSeriesData[i].topicThroughputs) {
    //   const newDataSet = makeDataSet(el);
    //   newDataSet.data.push(timeSeriesData[i].topicThroughputs[el]);
    // }
  }, []);

  //   const newDataSets: chartJSdataset[] = [];
  //   const timeArray: number[] = [];
  //   for (let i = 0; i < timeSeriesData.length; i++) {
  //     timeArray.push(timeSeriesData[i].time);
  //     const newDataSet = makeDataSet(timeSeriesData[i].cluster);
  //     for (const el in timeSeriesData[i].topicThroughputs) {
  //       newDataSet.data.push(timeSeriesData[i].topicThroughputs[el]);
  //     }
  //     newDataSt
  //   }

  // }, []);

  // when new data is received, new data to topic arrays in throughput data object
  useEffect(() => {
    console.log('SECOND USEEFFECT: TOPIC');
    console.log('tsd: ', timeSeriesData);
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
    const newData: chartJSdataset[] = JSON.parse(JSON.stringify(topicDatasets));
    // copy throughput data object to change before updating state
    console.log('newData: ', newData);
    for (const el in topicThroughputs) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        console.log(`el: ${el}, set: ${set}`);
        if (el === set.label) set.data.push(topicThroughputs[el]);
        if (set.data.length > xScope) set.data.shift();
      }
    }
    setTopicDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData.at(-1)]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // add x-axis size to state??

  const data = {
    labels: xSeries, // x-axis labels are timestamps from state
    datasets: topicDatasets,
    options: JSON.parse(JSON.stringify(lineGraphOptions)), // copy options object to make local changes
  };

  data.options.plugins.title.text = 'Throughput by Topic Group';
  data.options.scales.y.title.text = 'Messages/sec';
  data.options.scales.x.ticks.count = xScope;

  return <Line options={data.options} data={data} />;
};

export default TopicThroughput;
