import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import React from 'react';
import {chartJSdataset, datasetsObject} from '../../types';
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
  const {timeSeriesData, connectedCluster, topicDatasets, setTopicDatasets, xSeries, setXSeries} =
    props;

  // todo: allow modification of xscope?

  const [xScope, setxScope] = useState<number>(10);
  //const [dataSetIsInitialized, setDataSetIsInitialized] = useState<boolean>(false);

  // on arrival, initialize datasets if not initialized
  useEffect(() => {
    console.log('TOPIC USEEFFECT 1');

    // the keys for offsets and throughputs are identical, but offsets are ready one poll sooner, since throughputs require two data points to calculate
    // use offset data to initialize here on the initial poll so that throughput data have somewhere to land
    const newDatasets = initializeDatasets(timeSeriesData, 'topicOffsets', xScope, setXSeries);
    console.log('new ds: ', newDatasets);
    // fill initialized dataset with up to xScope columns of data, if available
    //const timeArray = [...xSeries];
    const timeArray = [];
    let i = timeSeriesData.length >= xScope ? timeSeriesData - xScope : 0;
    // NOTE: wrap in for loop for rerendering?
    timeArray.push(new Date(timeSeriesData[i].time).toLocaleTimeString());
    // while (timeArray.length < xScope - 1) timeArray.push('');
    for (i; i < timeSeriesData.length; i++) {
      for (const el of newDatasets) {
        el.timestamp = timeArray;
        for (const t in timeSeriesData[i].topicThroughputs) {
          if (t === el.data.label) {
            el.data.data.push(timeSeriesData[i].topicThroughputs[t]);
          }
        }
      }
    }
    console.log('preinit timearray, ', timeArray);

    console.log('init tds: ', newDatasets);
    //setXSeries(timeArray);
    setTopicDatasets(newDatasets);
  }, []);

  // when new data is received, new data to topic arrays in throughput data object
  useEffect(() => {
    console.log('TOPIC USEEFFECT 2');
    // need at least two data point to calculate rate of messages
    if (timeSeriesData.length <= 1 || topicDatasets.length < 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];
    const {topicThroughputs} = current;
    //add time to x-axis data so that it "scrolls" as data arrives
    // const newTime = [...xSeries];
    // console.log('newteim glbal xseries: ', newTime);
    // const time = new Date(current.time).toLocaleTimeString();
    // localXSeries.push(time);
    // console.log(localXSeries);
    // newTime.unshift(time);
    // if (newTime.length > 10) newTime.pop();
    // console.log('topic updates timeseries');
    // setXSeries(newTime);
    const newData: datasetsObject[] = JSON.parse(JSON.stringify(topicDatasets));
    // copy throughput data object to change before updating state
    // if (topicDatasets.length === 0) {
    //   return;
    // }
    newData.forEach(el => {
      console.log('from foreach: ', el.timestamp);
      el.timestamp.push(new Date(current.time).toLocaleTimeString());
      if (el.timestamp.length > xScope) el.timestamp.shift();
    });
    // set.timestamp.push(current.time);
    // newData.at(-1).timestamp = current.time;
    for (const el in topicThroughputs) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        if (el === set.data.label) set.data.data.push(topicThroughputs[el]);
        if (set.data.data.length > xScope) set.data.data.shift();
      }
    }
    console.log('nds from ue 2: ', newData);
    setTopicDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // global chart plugins - maybe move during refactoring
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // sort empty strings to end of labels array so that timestamps scroll from left
  let labels = topicDatasets.length ? topicDatasets[0].timestamp : [];
  if (labels.length < xScope) {
    console.log('pad: ', xScope - labels.length);
    const padding = xScope - labels.length;
    labels = labels.concat(Array(padding).fill('')).slice(1);
    console.log('L: ', labels);
  }
  // console.log('L presort ', labels);
  // console.log('gds length: ', topicDatasets.length ? topicDatasets[0].timestamp : []);

  // // move x axis window as time advances
  // let xStart = 1,
  //   xEnd = xScope;
  // labels.sort((a: string, b: string) => {
  //   return !a.length && b.length ? 1 : -1;
  // });
  // const firstBlank = labels.indexOf('');
  // console.log(firstBlank);
  // if (firstBlank > xScope) {
  //   xEnd = firstBlank - 1;
  //   xStart = firstBlank - xScope;
  // }

  const data = {
    labels, // x-axis labels are timestamps from state
    datasets: topicDatasets.map((el: datasetsObject) => el.data),
    options: JSON.parse(JSON.stringify(lineGraphOptions)), // copy options object to make local changes
  };

  data.options.plugins.title.text = 'Throughput by Topic Group';
  data.options.scales.y.title.text = 'Messages/sec';

  return <Line options={data.options} data={data} />;
};

export default TopicThroughput;
