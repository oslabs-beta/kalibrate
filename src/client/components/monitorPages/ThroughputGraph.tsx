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
import initializeLineGraph from '../../util/initializeLineGraph';

const ThroughputLineGraph = (props: LineGraphComponentProps) => {
  const {timeSeriesData, datasets, setDatasets, targetData} = props;
  const [xScope, setxScope] = useState<number>(10);

  useEffect(() => {
    // initialize line graph display
    const newDatasets = initializeLineGraph(timeSeriesData, targetData, xScope);
    console.log(typeof newDatasets);
    console.log(newDatasets);
    setDatasets(newDatasets);
  }, []);

  // when new data is received, add new data to topic arrays in throughput data object
  useEffect(() => {
    // don't proceed unless there are at least two data points -- we need at least that many to calculate a rate over time
    if (timeSeriesData.length <= 1 || datasets.length < 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];

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
