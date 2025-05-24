import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - start;
      const status = res.statusCode;
      console.log(
        `[${method}] ${originalUrl} — ${status} (${elapsed}ms)`
      );
    });

    next();
  }
}
