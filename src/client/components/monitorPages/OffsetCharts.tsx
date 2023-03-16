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
import Card from '@mui/material/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// @ts-ignore
const OffsetCharts = props => {
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
      Object.entries(timeSeriesData[timeSeriesData.length - 1].groupOffsets).map(
        ([key, value]) => key
      )
    );

    setYNumGroup(
      Object.entries(timeSeriesData[timeSeriesData.length - 1].groupOffsets).map(
        ([key, value]) => value
      )
    );

    setXNameTopic(
      Object.entries(timeSeriesData[timeSeriesData.length - 1].topicOffsets).map(
        ([key, value]) => key
      )
    );

    setYNumTopic(
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
        text: 'Offsets by Consumer Group',
      },
    },
    maintainAspectRatio: false,
  };

  const topicOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Offsets by Topic',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="barChartGrid">
      <Card
        sx={{
          backgroundColor: '#f9fdfe',
          marginRight: '25px',
          marginTop: '25px',
        }}
      >
        <div
          style={{
            height: 'calc(100vh - 150px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* 
        @ts-ignore */}
          <Bar options={groupOptions} data={groupData} />
        </div>
      </Card>
      <Card
        sx={{
          backgroundColor: '#f9fdfe',
          marginRight: '25px',
          marginTop: '25px',
        }}
      >
        <div
          style={{
            height: 'calc(100vh - 150px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* 
        @ts-ignore */}
          <Bar options={topicOptions} data={topicData} />
        </div>
      </Card>
    </div>
  );
};

export default OffsetCharts;
