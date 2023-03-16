import {Request, Response, NextFunction} from 'express';

// server types
export type controller = {
  [k: string]: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
};

export type errorObject = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};

export type topicMessage = {
  topic: string;
  partition: number;
  timestamp: string;
  offset: string;
  key: string;
  value: string;
};

export type consumedTopicPartitions = {
  [k: string]: boolean;
};

export type OffsetCollection = {
  [k: string]: number;
};
