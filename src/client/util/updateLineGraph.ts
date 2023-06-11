import {datasetsObject, newPollType, ThroughputCollection} from '../types';

export default function updateLineGraph(
  timeSeriesData: newPollType[],
  datasets: datasetsObject[],
  targetData: string,
  xScope: number
): datasetsObject[] {
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

  return newData;
}
