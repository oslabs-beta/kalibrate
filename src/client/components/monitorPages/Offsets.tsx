import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {OffsetProps} from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Offsets = (props: OffsetProps) => {
  //color palette for bar graph
  const colors: string[] = [
    '#e6194B',
    '#f58231',
    '#ffe119',
    '#bfef45',
    '#3cb44b',
    '#42d4f4',
    '#4363d8',
    '#911eb4',
    '#f032e6',
  ];
  const {timeSeriesData} = props;

  //state for x-axis and y-axis labels
  const [xNameGroup, setXNameGroup] = useState<string[]>([]);
  const [yNumGroup, setYNumGroup] = useState<any[]>([]);

  const [xNameTopic, setXNameTopic] = useState<string[]>([]);
  const [yNumTopic, setYNumTopic] = useState<any[]>([]);

  const topicDatasets = [];
  const groupDatasets = [];

  //set state as arrays of offsets data
  useEffect(() => {
    if (timeSeriesData.length <= 1) return;

    setXNameGroup(
      //@ts-ignore
      Object.entries(timeSeriesData[timeSeriesData.length - 1].groupOffsets).map(
        ([key, value]) => key
      )
    );

    setYNumGroup(
      //@ts-ignore
      Object.entries(timeSeriesData[timeSeriesData.length - 1].groupOffsets).map(
        ([key, value]) => value
      )
    );

    setXNameTopic(
      //@ts-ignore
      Object.entries(timeSeriesData[timeSeriesData.length - 1].topicOffsets).map(
        ([key, value]) => key
      )
    );

    setYNumTopic(
      //@ts-ignore
      Object.entries(timeSeriesData[timeSeriesData.length - 1].topicOffsets).map(
        ([key, value]) => value
      )
    );
  }, [timeSeriesData[timeSeriesData.length - 1]]);

  //populate datasets
  for (let i = 0; i < xNameGroup.length; i++) {
    groupDatasets.push({
      label: xNameGroup[i],
      data: [yNumGroup[i]],
      backgroundColor: [colors[i]],
    });
  }

  for (let i = 0; i < xNameTopic.length; i++) {
    topicDatasets.push({
      label: xNameTopic[i],
      data: [yNumTopic[i]],
      backgroundColor: [colors[i]],
    });
  }

  //input data for bar graph
  const groupData = {
    labels: ['Consumer Group Offsets'],
    datasets: groupDatasets,
  };

  const topicData = {
    labels: ['Topic Offsets'],
    datasets: topicDatasets,
  };

  //options to customize titles and legend
  const groupOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Consumer Group Offsets',
      },
    },
  };

  const topicOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Topic offsets',
      },
    },
  };

  return (
    <div>
      {/*
      //@ts-ignore*/}
      <Bar options={groupOptions} data={groupData} />
      {/*
      //@ts-ignore*/}
      <Bar options={topicOptions} data={topicData} />
    </div>
  );
};

export default Offsets;
