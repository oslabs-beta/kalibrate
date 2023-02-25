export const consumerColumn = [
  {field: 'id', headerName: 'Consumer ID', width: 250},
  {field: 'numOfTopics', headerName: 'Topics Subscribed', width: 150},
  {field: 'recordsLagMax', headerName: 'Records Lag (Max)', width: 150},
  {field: 'status', headerName: 'Status', width: 100},
];
export const consumerData = [
  {id: '1234567890', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '0987654321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
  {id: '12345670', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '09854321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
  {id: '1234567', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '0987654321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
  {id: '544567890', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '09888854321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
];

export const producerColumn = [
  {field: 'id', headerName: 'Topic Id', width: 100},
  {field: 'topicName', headerName: 'Topic Name', width: 250},
  {field: 'topicRole', headerName: 'Topic Role', width: 100},
];

export const producerData = [
  {id: '1', topicName: 'food', topicRole: 'life'},
  {id: '2', topicName: 'game', topicRole: 'life'},
  {id: '3', topicName: 'work', topicRole: 'money'},
];

/* TO DO
- set width to NOT a static number
- have table reize with window size

*/
