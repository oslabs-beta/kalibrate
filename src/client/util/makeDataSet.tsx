import palette from './palette';
import {chartJSdataset} from '../types';

let colorIndex: number = 0;
const makeDataSet = (topic: string) => {
  const colorString: string = palette[colorIndex];
  colorIndex++;
  if (colorIndex == palette.length) colorIndex = 0;
  const newTopicObj: chartJSdataset = {
    label: topic,
    data: [],
    // return once converted to rbga to add .5 a to background color
    borderColor: colorString,
    backgroundColor: colorString,
    hidden: false,
  };
  return newTopicObj;
};

export default makeDataSet;
