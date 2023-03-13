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
    const timeArray = [];
    let i = timeSeriesData.length >= xScope ? timeSeriesData.length - xScope : 0;
    timeArray.push(new Date(timeSeriesData[i].time).toLocaleTimeString());
    while (timeArray.length < xScope - 1) timeArray.push('');
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

    newData.forEach(el => {
      console.log('from foreach: ', el.timestamp);
      el.timestamp.push(new Date(current.time).toLocaleTimeString());
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

  // sort empty strings to end of labels array so that timestamps scroll from left
  const labels = topicDatasets.length ? topicDatasets[0].timestamp : [];

  // move x axis window as time advances
  let xStart = 1,
    xEnd = xScope;
  labels.sort((a: string, b: string) => {
    return !a.length && b.length ? 1 : -1;
  });
  const firstBlank = labels.indexOf('');
  console.log(firstBlank);
  if (firstBlank > xScope) {
    xEnd = firstBlank - 1;
    xStart = firstBlank - xScope;
  }

  const data = {
    labels: labels.slice(xStart, xEnd),
    datasets: topicDatasets.map((el: datasetsObject) => el.data),
    options: JSON.parse(JSON.stringify(lineGraphOptions)), // copy options object to make local changes
  };

  data.options.plugins.title.text = 'Throughput by Topic Group';
  data.options.scales.y.title.text = 'Messages/sec';

  return <Line options={data.options} data={data} />;
};

export default TopicThroughput;
