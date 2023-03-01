import {MouseEvent} from 'react';

export type brokers = {
  nodeId: number;
  host: string;
  port: number;
};

export type clusterData = {
  clusterId: string;
  controllers: number;
  brokers: brokers[];
};

export type partitions = {
  isr: number[];
  leader: number;
  offlineReplicas: number[];
  partitionErrorCode: number;
  partitionId: number;
  replicas: number[];
};

export type offsets = {
  high: string;
  low: string;
  offset: string;
  partition: number;
};

export type topics = {
  name: string;
  partitions: partitions[];
  offsets: offsets[];
};

export type topicData = {
  topics: topics[];
};

export type groupData = {
  [k: string]: any[];
};

export type connectedClusterData = {
  clusterData?: clusterData;
  topicData?: topicData;
  groupData?: groupData;
};

export type BrokersProps = {
  clusterData?: clusterData;
};

export type TopicsDisplayProps = {
  topicData?: topicData;
};

export interface ConsumerProps {
  groupData: {[k: string]: any}[];
}

export type clickHandler = (
  event: MouseEvent<HTMLButtonElement>,
  topic: string,
  partitions?: partitions[]
) => void;

export type TopicsContext = {
  handleComponentChange: clickHandler;
  selectedTopic: string;
  topicPartitions: partitions[];
};

export type message = {
  topic: string;
  partition: string;
  timestamp: string;
  offset: number;
  key: string;
  value: string;
};

export interface ConsumerProps {
  groupData: {[k: string]: any}[];
  connectedCluster: string;
}
