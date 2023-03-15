import {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {datasetsObject, GroupLineGraphComponentProps} from '../../types';
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

const GroupThroughput = (props: GroupLineGraphComponentProps) => {
  const {timeSeriesData, groupDatasets, setGroupDatasets} = props;

  // todo: allow modification of xscope?

  const [xScope, setxScope] = useState<number>(10);

  // when new data is received, new data to group arrays in throughput data object
  useEffect(() => {
    console.log('group useeffect 1');
    // the keys for offsets and throughputs are identical, but offsets are ready one poll sooner, since throughputs require two data points to calculate
    // use offset data to initialize here on the initial poll so that throughput data have somewhere to land
    const newDatasets = initializeDatasets(timeSeriesData, 'groupOffsets', xScope);
    // fill initialized dataset with up to xScope columns of data, if available
    const timeArray = [];
    console.log('GROUP tsd: ', timeSeriesData);
    // if less than xScope elements in timeseriesdata, push their times to timearray and fill to xScope with ""
    if (timeSeriesData.length < xScope) {
      console.log('GROUP short time array: ', timeSeriesData.length);
      let i = 0;
      while (i < timeSeriesData.length) {
        console.log('i=', i);
        timeArray.push(new Date(timeSeriesData[i].time).toLocaleTimeString());
        i++;
      }
      console.log('GROUP short adding spaces');
      while (timeArray.length < xScope) {
        timeArray.push('');
      }
    } else {
      console.log('GROUP long time array');

      for (let i = timeSeriesData.length - xScope; i < timeSeriesData.length; i++) {
        timeArray.push(new Date(timeSeriesData[i].time).toLocaleTimeString());
      }
    }

    // let i = timeSeriesData.length >= xScope ? timeSeriesData.length - xScope : 0;
    // console.log('i: ', i);
    // if (i < xScope) {
    //   for (let j = 0; j < i; j++) {
    //     timeArray.push(new Date(timeSeriesData[i].time).toLocaleTimeString());
    //   }
    //   while (timeArray.length < xScope) timeArray.push('');
    // } else {
    //   for (let j = i; j < timeSeriesData.length; j++) {
    //     timeArray.push(new Date(timeSeriesData[j].time).toLocaleTimeString());
    //   }
    // }
    console.log('timearray: ', timeArray);

    let i = timeSeriesData.length >= xScope ? timeSeriesData.length - xScope : 0;
    for (i; i < timeSeriesData.length; i++) {
      for (const el of newDatasets) {
        el.timestamp = timeArray;
        for (const t in timeSeriesData[i].groupThroughputs) {
          if (t === el.data.label) {
            // @ts-ignore
            el.data.data.push(timeSeriesData[i].groupThroughputs[t]);
          }
        }
      }
    }

    setGroupDatasets(newDatasets);
  }, []);

  useEffect(() => {
    // don't go forward without sufficient data for calculations
    if (timeSeriesData.length <= 1 || groupDatasets.length < 1) return;
    const current = timeSeriesData[timeSeriesData.length - 1];
    const {groupThroughputs} = current;

    // copy throughput data object to change before updating state
    const newData: datasetsObject[] = JSON.parse(JSON.stringify(groupDatasets));

    newData.forEach(el => {
      console.log('from foreach: ', el.timestamp);
      el.timestamp.push(new Date(current.time).toLocaleTimeString());
    });
    for (const el in groupThroughputs) {
      // push y-axis data to the appropriate array
      // shift oldest data point off to maintain current data on graph
      // update state
      for (const set of newData) {
        // @ts-ignore
        if (el === set.data.label) set.data.data.push(groupThroughputs[el]);
        if (set.data.data.length > xScope) set.data.data.shift();
      }
    }
    console.log('setting gds in grup useefect 2', groupDatasets);
    setGroupDatasets(newData);
    // using the last element of the array as the dependency guarantees updates both while the array gets longer and after it reaches max length of 50
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  // chart plugins
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // sort empty strings to end of labels array so that timestamps scroll from left
  const labels = groupDatasets.length ? groupDatasets[0].timestamp : [];
  console.log('L presort ', labels);
  console.log('gds length: ', groupDatasets.length ? groupDatasets[0].timestamp : []);

  // move x axis window as time advances
  let xStart = 1,
    xEnd = xScope;
  labels.sort((a, b) => {
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
    datasets: groupDatasets.map((el: datasetsObject) => el.data),
    options: JSON.parse(JSON.stringify(lineGraphOptions)), // copy options object to make local changes
  };

  data.options.plugins.title.text = 'Throughput by Consumer Group';
  data.options.scales.y.title.text = 'Messages/sec';

  return <Line options={data.options} data={data} />;
};

export default GroupThroughput;
