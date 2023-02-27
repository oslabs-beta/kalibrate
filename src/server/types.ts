import {Request, Response, NextFunction, RequestHandler} from 'express';

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
