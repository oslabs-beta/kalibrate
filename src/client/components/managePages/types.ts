import {MouseEvent} from 'react';

export type topics = {
  name: string;
  partitions: partitions[];
  offsets: offsets[];
};

export type TopicsProps = {
  topics: topics[];
};

export type clickHandler = (event: MouseEvent<HTMLButtonElement>) => void;

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

export type TopicsDisplayProps = {
  topics: topics[];
  selectedTopic: string;
  topicComponent: string;
  handleComponentChange: clickHandler;
};

export type MessageDisplayProps = {
  topic: string;
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