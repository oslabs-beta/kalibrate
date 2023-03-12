import {empty} from '@prisma/client/runtime';
import {chartJSdataset, newPollType, timeSeriesData} from '../types';
import makeDataSet from './makeDataSet';

// create labels array and one chartJS dataset object per group
const initializeDatasets = (
  timeSeriesData: newPollType[],
  subset: string,
  xScope: number,
  setXSeries
  // useStateFunction // setter function from whichever component calls initializeDatasets
) => {
  console.log('initializing with dataset: ', timeSeriesData[0]);
  const newDataSets: chartJSdataset[] = [];
  const blankArray = new Array(xScope);
  blankArray.fill('');
  setXSeries(blankArray);
  console.log(timeSeriesData[0][subset]);
  console.log('subset: ', subset);

  for (const el in timeSeriesData[0][subset]) {
    const newDataSet = makeDataSet(el);
    console.log('in for loop: ', newDataSet);
    newDataSets.push(newDataSet);
  }
  console.log('returning: ', newDataSets);
  return newDataSets;
};

export default initializeDatasets;
