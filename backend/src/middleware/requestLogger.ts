import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl } = req;

  let logLine = `[${timestamp}] ${method} ${originalUrl}`;

  if (req.body?.query) {
    const operationMatch = req.body.query.match(/(query|mutation)\s+(\w+)/);
    if (operationMatch) {
      logLine += ` | GraphQL Operation: ${operationMatch[1]} ${operationMatch[2]}`;
    }
    if (req.body.variables && Object.keys(req.body.variables).length > 0) {
      logLine += ` | Variables: ${JSON.stringify(req.body.variables)}`;
    }
  }

  console.log(logLine);
  next();
};
