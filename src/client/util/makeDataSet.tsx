import palette from './palette';
import {datasetsObject} from '../types';

let colorIndex: number = 0;
const makeDataSet = (topic: string) => {
  const colorString: string = palette[colorIndex];
  colorIndex++;
  if (colorIndex == palette.length) colorIndex = 0;
  const newTopicObj: datasetsObject = {
    timestamp: [],
    data: {
      label: topic,
      data: [],
      borderColor: colorString,
      backgroundColor: colorString,
      hidden: false,
    },
  };
  return newTopicObj;
};

export default makeDataSet;
