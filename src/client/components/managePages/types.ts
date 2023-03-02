import {MouseEvent} from 'react';

export type connectionConfig = {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: string;
    username: string;
    password: string;
  };
};

export type ConnectProps = {
  setConnectedCluster: (clientId: string) => void;
  setSessionClusters: (clientId: string[]) => void;
  sessionClusters: string[];
  setIsConnected: (clientId: boolean) => void;
};

export type DashboardProps = {
  sessionClusters: string[];
  setConnectedCluster: (clientId: string) => void;
};

export type OverviewProps = {
  connectedCluster: string;
  data: connectedClusterData;
};

export type brokers = {
  nodeId: number;
  host: string;
  port: number;
};

export type clusterData = {
  clusterId?: string;
  controllers?: number;
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

export type group = {
  errorCode: number;
  groupId: string;
  state: string;
  protocolType: string;
  protocol: string;
};

export type groupData = group[];

export type connectedClusterData = {
  clusterData: clusterData;
  topicData: topicData;
  groupData: groupData;
};

export type BrokersProps = {
  clusterData: clusterData;
  connectedCluster: string;
};

export type BrokersDisplayProps = {
  clusterData: clusterData;
};

export type TopicsProps = {
  connectedCluster: string;
};

export type TopicsDisplayProps = {
  topicData: topicData;
};

export interface ConsumerProps {
  groupData: groupData;
  connectedCluster: string;
}

export interface ConsumerDisplayProps {
  groupData: {[k: string]: any}[];
}

export type BreadcrumbProps = {
  topicName: string;
  topicComp: string;
};

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
  groupData: { [k: string]: any }[];
}