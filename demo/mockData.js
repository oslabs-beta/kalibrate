import {Link} from '@mui/material';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import PartitionsDisplay from '../src/client/components/managePages/PartitionsDisplay';
//CONSUMER DATA
export const consumerColumn = [
  {field: 'consumerId', headerName: 'Consumer ID', width: 250},
  {field: 'numOfTopics', headerName: 'Topics Subscribed', width: 150},
  {field: 'recordsLagMax', headerName: 'Records Lag (Max)', width: 150},
  {field: 'connectionStatus', headerName: 'Status', width: 100},
];
export const consumerData = [
  {consumerId: '1234567890', numOfTopics: '21', recordsLagMax: '4324', connectionStatus: 'hoi'},
  {consumerId: '0987654321', numOfTopics: '43', recordsLagMax: '8114', connectionStatus: 'ioh'},
  {consumerId: '12345670', numOfTopics: '21', recordsLagMax: '4324', connectionStatus: 'hoi'},
  {consumerId: '09854321', numOfTopics: '43', recordsLagMax: '8114', connectionStatus: 'ioh'},
  {consumerId: '1234567', numOfTopics: '21', recordsLagMax: '4324', connectionStatus: 'hoi'},
  {consumerId: '0987654321', numOfTopics: '43', recordsLagMax: '8114', connectionStatus: 'ioh'},
  {consumerId: '544567890', numOfTopics: '21', recordsLagMax: '4324', connectionStatus: 'hoi'},
  {consumerId: '09888854321', numOfTopics: '43', recordsLagMax: '8114', connectionStatus: 'ioh'},
];

//PRODUCER DATA
export const producerColumn = [
  {field: 'topicId', headerName: 'Topic Id', width: 100},
  {field: 'topicName', headerName: 'Topic Name', width: 250},
  {field: 'topicRole', headerName: 'Topic Role', width: 100},
];
export const producerData = [
  {topicId: '2', topicName: 'game', topicRole: 'life'},
  {topicId: '1', topicName: 'food', topicRole: 'life'},
  {topicId: '3', topicName: 'work', topicRole: 'money'},
];

//TOPIC DATA
export const topicColumn = [
  {field: 'topicName', headername: 'Topic Name', width: 200},
  {field: 'offsets', headerName: 'Offsets Total', width: 100},
  {field: 'numPartitions', headerName: 'Partitions Total', width: 100},
];
export const topicData = [
  {
    topicName: 'disname',
    replication: '21',
    numPartitions: '54',
    numMessages: '77',
  },
  {
    topicName: 'topicd1',
    replication: '2',
    numPartitions: '234',
    numMessages: '1337',
  },
];

//PARTITION DATA
export const partitionColumn = [
  {field: 'partId', headerName: 'Partition ID', width: 100},
  {field: 'leader', headerName: 'Leader', width: 100},
  {field: 'isr', headerName: 'ISR', width: 100},
  {field: 'replicas', headerName: 'Replicas', width: 100},
  {field: 'offlineReplicas', headerName: 'Offline Replicas', width: 100},
  {field: 'error', headerName: 'Error Code', width: 100},
];
export const partitionData = [{partId: 0, leader: 0, offset: 100, high: 50, low: 150}];
//MESSAGE DATA
export const messageColumn = [
  {field: 'key', headerName: 'Key', width: 100},
  {field: 'val', headerName: 'Value', width: 100},
  {field: 'offset', headerName: 'Offset', width: 50},
  {field: 'partition', headerName: 'Partition', width: 50},
];
export const messageData = [{key: 'hi', val: 'ho', offset: 100, partition: 0}];

//BROKER DATA
export const brokerColumn = [
  {field: 'nodeId', headerName: 'Node ID', width: 100},
  {field: 'host', headerName: 'Host', width: 200},
  {field: 'port', headerName: 'Port', width: 100},
];

export const brokerData = [{id: 0, host: 'localhost', port: 9091}];
/* 
REMEMBER
- all rows need an 'id' 
*/
