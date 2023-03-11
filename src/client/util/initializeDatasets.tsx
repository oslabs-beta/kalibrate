import {chartJSdataset} from '../types';

// create labels array and one chartJS dataset object per group
const initializeDatasets = (
  dataSet,
  xScope,
  setXSeries,
  makeDataSet,
  useStateFunction // setter function from whichever component calls initializeDatasets
) => {
  console.log('initializing');
  const blankArray = new Array(xScope);
  blankArray.fill('');
  setXSeries(blankArray);
  const newDataSets: chartJSdataset[] = [];
  for (const el in dataSet) {
    const newDataSet = makeDataSet(el);
    newDataSet.data.length = xScope;
    newDataSet.data.fill(0);
    newDataSets.push(newDataSet);
  }
  useStateFunction(newDataSets);
};

export default initializeDatasets;
