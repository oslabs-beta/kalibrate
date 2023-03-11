import {chartJSdataset} from '../types';

// create labels array and one chartJS dataset object per topic
const initializeDatasets = (
  xScope,
  setXSeries,
  timeSeriesData,
  makeTopicDataSet,
  setTopicDatasets
) => {
  console.log('initializing');
  const blankArray = new Array(xScope);
  blankArray.fill('');
  setXSeries(blankArray);
  const newDataSets: chartJSdataset[] = [];
  for (const el in timeSeriesData[0].topicOffsets) {
    const newDataSet = makeTopicDataSet(el);
    newDataSet.data.length = xScope;
    newDataSet.data.fill(0);
    newDataSets.push(newDataSet);
  }
  setTopicDatasets(newDataSets);
};

export default initializeDatasets;
