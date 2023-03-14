import {MouseEvent} from 'react';

export type RedirectProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  children: JSX.Element;
};

export type LoginProps = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export type SignupProps = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export type ProtectedProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  children: JSX.Element;
};

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

export type storedClient = {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: string;
    username: string;
  };
};

export type DefaultProps = {
  storedClients: storedClient[];
};

export type ClientProps = {
  selectedClient: string;
  setSelectedClient: (clientId: string) => void;
  connectedClient: string;
  setConnectedClient: (clientId: string) => void;
  storedClients: storedClient[];
  setStoredClients: (storedClient: storedClient[]) => void;
  isConnectionLoading: boolean;
  isError: string;
  setIsError: (clientId: string) => void;
  isDeleteLoading: boolean;
  setIsDeleteLoading: (clientId: boolean) => void;
};

export type ConnectProps = {
  setSelectedClient: (clientId: string) => void;
  storedClients: storedClient[];
  setStoredClients: (storedClient: storedClient[]) => void;
};

export type DashboardProps = {
  connectedClient: string;
  selectedClient: string;
  setSelectedClient: (clientId: string) => void;
  storedClients: storedClient[];
  isLoading: boolean;
};

export type ConnectionContainerProps = {
  selectedClient: string;
  setSelectedClient: (clientId: string) => void;
  connectedClient: string;
  setConnectedClient: (clientId: string) => void;
  storedClients: storedClient[];
  setStoredClients: (storedClient: storedClient[]) => void;
  isConnectionLoading: boolean;
  isConnectionError: string;
  setIsConnectionError: (clientId: string) => void;
  isDeleteLoading: boolean;
  setIsDeleteLoading: (clientId: boolean) => void;
};

export type OverviewProps = {
  connectedCluster: string;
  data: connectedClusterData;
  timeSeriesData: any;
};

export type TopicThroughputProps = {
  connectedCluster: string;
  timeSeriesData: newPollType[];
};

export type TopicLineGraphComponentProps = {
  timeSeriesData: timeSeriesData[];
  topicDatasets: datasetsObject[];
  setTopicDatasets: (topicDatasets: datasetsObject[]) => void;
};

export type GroupLineGraphComponentProps = {
  timeSeriesData: timeSeriesData[];
  groupDatasets: datasetsObject[];
  setGroupDatasets: (groupDatasets: datasetsObject[]) => void;
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
  members: any;
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
  connectedCluster: string;
  setConnectedClusterData: any;
  connectedClusterData: any;
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
  connectedCluster: string;
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
  groupData: groupData;
}

export type newPollType = {
  cluster?: string;
  time: number;
  groupStatus?: {
    [k: string]: number;
  };
  topicOffsets: OffsetCollection;
  groupOffsets: OffsetCollection;
  topicThroughputs?: ThroughputCollection;
  groupThroughputs?: ThroughputCollection;
  topicReplicaStatus?: replicaStatus;
};

export type OffsetCollection = {
  [k: string]: number;
};

export type GroupTopic = {
  topic: string;
  partitions: TopicPartitions[];
};

export type TopicPartitions = {
  partition: number;
  offset: string;
  metadata: any;
};

export type throughputData = {
  [k: string]: number | null;
};

export type timeSeriesData = {
  cluster: string;
  time: number;
  groupOffsets: {};
  groupStatus: {};
  topicOffsets: {};
  groupThroughputs: {};
  topicThroughputs: {};
};

export type ThroughputCollection = {
  [k: string]: {};
};

export type chartJSdataset = {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  hidden: boolean;
};

export type PasswordStateTypes = {
  [k: string]: boolean;
};
export type FormStateTypes = {
  [k: string]: string;
};
export type SettingsProps = {
  isAlertEnabled: {[key: string]: boolean};
  setIsAlertEnabled: (isAlertEnabled: {[key: string]: boolean}) => void;
  savedURIs: {[key: string]: string};
  setSavedURIs: (uris: {[key: string]: string}) => void;
  isSlackError: boolean;
  setIsSlackError: (error: boolean) => void;
  logout: AccountProps;
};
export type AccountProps = {
  logout: () => void;
};
export type NotificationsProps = {
  isAlertEnabled: {[key: string]: boolean};
  setIsAlertEnabled: (isAlertEnabled: {[key: string]: boolean}) => void;
  savedURIs: {[key: string]: string};
  setSavedURIs: (uris: {[key: string]: string}) => void;
  isSlackError: boolean;
  setIsSlackError: (error: boolean) => void;
};

export type ManageProps = {
  connectedCluster: string;
};

export interface NavbarProps {
  isAuthenticated: boolean;
  isConnected?: boolean;
  logout: () => void;
  alerts: string[];
  setAlerts: (alerts: string[]) => void;
}

export type OffsetProps = {
  timeSeriesData: newPollType[];
};

export type SchnaxProps = {
  message: string;
};

export interface UserMenuProps {
  isAuthenticated: boolean;
  isConnected?: boolean;
  logout: () => void;
}

export type MembersDisplayContext = {
  groupData: groupData;
};

export type replicaStatus = {
  [k: string]: number;
};

export type chartJSradarProps = {
  labels: string[];
  datasets: chartJSradarDataset[];
  options?: {};
};

export type chartJSradarDataset = {
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
  data: number[];
};

export type datasetsObject = {
  timestamp: string[];
  data: chartJSdataset;
};

export type TrafficAndHealthProps = {
  timeSeriesData: newPollType[];
  connectedCluster: string;
  topicDatasets: datasetsObject[];
  setTopicDatasets: (topicDatasets: datasetsObject[]) => void;
  groupDatasets: datasetsObject[];
  setGroupDatasets: (groupDatasets: datasetsObject[]) => void;
};
