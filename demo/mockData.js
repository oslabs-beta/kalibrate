import {Link} from '@mui/material';

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
  {field: 'topicName', headername: 'Name', width: 250},
  {field: 'replication', headerName: 'Replication Factor', width: 50},
  {field: 'numPartitions', headerName: 'Num of Paritions', width: 50},
  {field: 'numMessages', headerName: 'Num of Messages', width: 50},
  {field: 'linkToPart', headerName: 'See Partitions', width: 150, renderCell: () => <Link></Link>},
  {field: 'linkToMsg', headerName: 'See Messages', width: 150, renderCell: () => <Link></Link>},
];
export const topicData = [];

//PARTITION DATA
export const partitionColumn = [
  {field: 'partId', headerName: 'Partition ID', width: 100},
  {field: 'leader', headerName: 'Leader', width: 50},
  {field: 'offset', headerName: 'Offset', width: 50},
  {field: 'high', headerName: 'High', width: 50},
  {field: 'low', headerName: 'low', width: 50},
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
/* TO DO
- topics data grid to be done last!!!!
- set width to NOT a static number
- have table reize with window size
- specifically topic column: add two column to hold links/routes to partition and messages
- isConnected !== connected xd
-consumers' connection status to be toggle?!
REMEMBER
- all rows need an 'id' 
*/
