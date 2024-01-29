import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization)
      return res.status(401).send({ message: 'Missing Authorization Header' });

    const token = req.headers.authorization.split(' ')[1]; // Get token from 'Bearer {token}'
    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.user = decodedToken; // Attach user to request object
        next();
      })
      .catch((error) => {
        res.status(401).send({ message: 'Unauthorized' });
      });
  }
}
