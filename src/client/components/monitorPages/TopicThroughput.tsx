import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {datasetsObject, TopicLineGraphComponentProps} from '../../types';
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

const TopicThroughput = (props: TopicLineGraphComponentProps) => {
  const {timeSeriesData, topicDatasets, setTopicDatasets} = props;

  // todo: allow modification of xscope?

  const [xScope, setxScope] = useState<number>(10);

  // on arrival, initialize datasets if not initialized
  useEffect(() => {
    // the keys for offsets and throughputs are identical, but offsets are ready one poll sooner, since throughputs require two data points to calculate
    // use offset data to initialize here on the initial poll so that throughput data have somewhere to land
    const newDatasets = initializeDatasets(timeSeriesData, 'topicOffsets', xScope);
    // fill initialized dataset with up to xScope columns of data, if available
    const timeArray = [];

    if (timeSeriesData.length < xScope) {
      let i = 1;
      while (i < timeSeriesData.length) {
        timeArray.push(new Date(timeSeriesData[i].time).toLocaleTimeString());
        i++;
      }

      while (timeArray.length < xScope) {
        timeArray.push('');
      }
    } else {
      for (let i = timeSeriesData.length - xScope; i < timeSeriesData.length; i++) {
        timeArray.push(new Date(timeSeriesData[i].time).toLocaleTimeString());
      }
    }

    let i = timeSeriesData.length >= xScope ? timeSeriesData.length - xScope : 0;
    for (i; i < timeSeriesData.length; i++) {
      for (const el of newDatasets) {
        el.timestamp = timeArray;
        for (const t in timeSeriesData[i].topicThroughputs) {
          if (t === el.data.label) {
            // @ts-ignore
            el.data.data.push(timeSeriesData[i].topicThroughputs[t]);
          }
        }
      }
    }

    setTopicDatasets(newDatasets);
  }, []);

  // when new data is received, new data to topic arrays in throughput data object
  useEffect(() => {
    // don't go forward without sufficient data for calculations
    if (timeSeriesData.length <= 1 || topicDatasets.length < 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];
    const {topicThroughputs} = current;

    // copy throughput data object to change before updating state
    const newData: datasetsObject[] = JSON.parse(JSON.stringify(topicDatasets));

    // if there are empty strings in the x axis labels, replace the first one with the curernt time
    // otherwise, push the new time to the array and shift the oldest time off
    newData.forEach(el => {
      const i = el.timestamp.indexOf('');
      if (i !== -1) {
        el.timestamp[i] = new Date(current.time).toLocaleTimeString();
      } else {
        el.timestamp.push(new Date(current.time).toLocaleTimeString());
        el.timestamp.shift();
      }
    });
    for (const el in topicThroughputs) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        // @ts-ignore
        if (el === set.data.label) set.data.data.push(topicThroughputs[el]);
        if (set.data.data.length > xScope) set.data.data.shift();
      }
    }
    setTopicDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // chart plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const data = {
    labels: topicDatasets.length ? topicDatasets[0].timestamp : [],
    datasets: topicDatasets.map((el: datasetsObject) => el.data),
    options: JSON.parse(JSON.stringify(lineGraphOptions)), // copy options object to make local changes
  };

  data.options.plugins.title.text = 'Throughput by Topic';
  data.options.scales.y.title.text = 'Messages/sec';
  data.options.maintainAspectRatio = false;

  return (
    <div
      style={{
        height: 'calc(100vh - 150px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Line options={data.options} data={data} />
    </div>
  );
};

export default TopicThroughput;
