import {Request, Response, NextFunction} from 'express';

export type errorObject = {
  log: string;
  status: number;
  message: {
    err: string;
  };
};

export type controller = {
  [k: string]: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
  kafka?: any;
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
