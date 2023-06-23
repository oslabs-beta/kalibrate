import {newPollType, datasetsObject} from '../types';
import initializeDatasets from './initializeDatasets';

export default function initializeLineGraph(
  timeSeriesData: newPollType[],
  targetData: string,
  xScope: number
): datasetsObject[] {
  const dataThroughputProp = targetData === 'topics' ? 'topicThroughputs' : 'groupThroughputs';
  const dataOffsetProp = targetData === 'topics' ? 'topicOffsets' : 'groupOffsets';

  // on arrival, initialize datasets if not initialized
  const newDatasets: datasetsObject[] = initializeDatasets(timeSeriesData, dataOffsetProp, xScope);
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
  return newDatasets;
}
