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
  console.log('initializing');
  const newDataSets: chartJSdataset[] = [];
  const blankArray = new Array(xScope);
  blankArray.fill('');
  setXSeries(blankArray);
  for (const el in timeSeriesData[0][subset]) {
    const newDataSet = makeDataSet(el);
    newDataSets.push(newDataSet);
  }

  return newDataSets;
};

export default initializeDatasets;
