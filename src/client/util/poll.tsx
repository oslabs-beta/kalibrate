import {newPollType, GroupTopic, OffsetCollection} from '../types';

// long poll to connected kafka instance for data
// since we have to get data from kafka with KJS I'm not sure websockets do anything but add an intermediate step
// possible todo: modularize poll into a different file
const poll = (
  connectedClient,
  setConnectedClusterData,
  timeSeriesData,
  xSeries,
  setXSeries,
  addTimeSeries
) => {
  fetch(`/api/data/${connectedClient}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => {
      const newPoll: newPollType = {
        cluster: connectedClient,
      };
      newPoll.time = Date.now();
      setConnectedClusterData(data);

      // process data from connected cluster into more graph-ready form:
      // can be further processed if we want, maybe in the graph component

      // percent of groups by status
      let stable = 0,
        empty = 0;
      for (const el of data.groupData) {
        if (el.state === 'Stable') stable++;
        if (el.state === 'Empty') empty++;
      }
      newPoll.groupStatus = {
        total: data.groupData.length,
        stable,
        empty,
        other: data.groupData.length - stable - empty,
      };

      // topic replica status (percentage in sync)
      newPoll.topicReplicaStatus = {};
      for (const el of data.topicData.topics) {
        let replicas = 0;
        let isr = 0;
        for (const p of el.partitions) {
          replicas += p.replicas.length;
          isr += p.isr.length;
        }

        newPoll.topicReplicaStatus[el.name] = Math.round((isr / replicas) * 100);
      }

      // count of offsets by topic
      newPoll.topicOffsets = {};
      newPoll.topicThroughputs = {};
      if (data.topicData.topics.length) {
        for (const t of data.topicData.topics) {
          newPoll.topicOffsets[t.name] = t.offsets.reduce((acc: number, curr: OffsetCollection) => {
            return acc + Number(curr.offset);
          }, 0);

          // rate of throughtput by topic since last poll

          if (timeSeriesData.at(-1)) {
            const previous: newPollType = timeSeriesData.at(-1);
            newPoll.topicThroughputs[t.name] =
              (newPoll.topicOffsets[t.name] - previous.topicOffsets[t.name]) /
              ((newPoll.time - previous.time) / 1000);
          }
        }
      }

      // count of offsets by group
      newPoll.groupOffsets = {};
      newPoll.groupThroughputs = {};
      for (const g in data.groupOffsets) {
        //const groupName = g;
        let sum = 0;
        data.groupOffsets[g].forEach((el: GroupTopic) => {
          el.partitions.forEach(p => {
            sum += Number(p.offset);
          });
        });
        newPoll.groupOffsets[g] = sum;

        // rate of throughtput by group since last poll

        if (timeSeriesData.at(-1)) {
          const previous: newPollType = timeSeriesData.at(-1);
          newPoll.groupThroughputs[g] =
            (newPoll.groupOffsets[g] - previous.groupOffsets[g]) /
            ((newPoll.time - previous.time) / 1000);
        }
      }
      // add current time to x-axis labels
      const newTimes = [new Date(newPoll.time).toLocaleTimeString()].concat(xSeries);

      if (newTimes.length > 10) newTimes.pop();
      console.log('nt: ', newTimes);
      setXSeries(newTimes);

      // add timeseriesdata to state so we can drill it/use it for graphing
      addTimeSeries(newPoll);
    })
    .catch(err => console.log(`Error polling data: ${err}`));
};

export default poll;
