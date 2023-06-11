import {datasetsObject, newPollType} from '../types';
import makeDataSet from './makeDataSet';

// create labels array and one chartJS dataset object per group
const initializeDatasets = (
  timeSeriesData: newPollType[],
  subset: string,
  xScope: number
  // useStateFunction // setter function from whichever component calls initializeDatasets
) => {
  const newDatasets: datasetsObject[] = [];
  const blankArray = new Array(xScope);
  blankArray.fill('');
  // @ts-ignore
  for (const el in timeSeriesData[0][subset]) {
    const newDataset = makeDataSet(el);
    newDatasets.push(newDataset);
  }
  console.log('INIT DS: ', newDatasets);
  return newDatasets;
};

export default initializeDatasets;
