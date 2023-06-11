import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {datasetsObject, LineGraphComponentProps, ThroughputCollection} from '../../types';
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

const ThroughputLineGraph = (props: LineGraphComponentProps) => {
  const {timeSeriesData, datasets, setDatasets, targetData} = props;
  const [xScope, setxScope] = useState<number>(10);

  useEffect(() => {
    const dataThroughputProp = targetData === 'topics' ? 'topicThroughputs' : 'groupThroughputs';
    const dataOffsetProp = targetData === 'topics' ? 'topicOffsets' : 'groupOffsets';

    // on arrival, initialize datasets if not initialized
    const newDatasets = initializeDatasets(timeSeriesData, dataOffsetProp, xScope);
    console.log(typeof newDatasets);
    console.log('NDS: ', newDatasets);
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
        for (const t in timeSeriesData[i][dataThroughputProp]) {
          if (t === el.data.label) {
            // @ts-ignore
            el.data.data.push(timeSeriesData[i][dataThroughputProp][t]);
          }
        }
      }
    }
    setDatasets(newDatasets);
  }, []);

  // when new data is received, add new data to topic arrays in throughput data object
  useEffect(() => {
    // don't proceed unless there are at least two data points -- we need at least that many to calculate a rate over time
    if (timeSeriesData.length <= 1 || datasets.length < 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];

    console.log('TARGET DATA: ', targetData);
    let throughputs: ThroughputCollection = {};
    if (targetData === 'topics') {
      throughputs = current.topicThroughputs!;
    } else if (targetData === 'groups') {
      throughputs = current.groupThroughputs!;
    }

    // clone throughput data object before changing it and updating state with it
    const newData: datasetsObject[] = JSON.parse(JSON.stringify(datasets));

    // labeling logic for x axis
    newData.forEach(el => {
      const i = el.timestamp.indexOf('');
      if (i !== -1) {
        el.timestamp[i] = new Date(current.time).toLocaleTimeString();
      } else {
        el.timestamp.push(new Date(current.time).toLocaleTimeString());
        el.timestamp.shift();
      }
    });

    for (const el in throughputs) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        // @ts-ignore
        if (el === set.data.label) set.data.data.push(throughputs[el]);
        if (set.data.data.length > xScope) set.data.data.shift();
      }
    }
    setDatasets(newData);
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // chart plugins
  // chart plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const data = {
    labels: datasets.length ? datasets[0].timestamp : [],
    datasets: datasets.map((el: datasetsObject) => el.data),
    // copy options object to make local changes
    options: JSON.parse(JSON.stringify(lineGraphOptions)),
  };

  data.options.plugins.title.text = `Throughput by ${
    targetData === 'topics' ? 'Topic' : 'Consumer Group'
  }`;
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

export default ThroughputLineGraph;
