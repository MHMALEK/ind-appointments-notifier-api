import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Get token from 'Bearer {token}'

    if (!token) {
      throw new UnauthorizedException('Missing Authorization Header');
    }

    return admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        request.user = decodedToken; // Attach user to request object
        return true;
      })
      .catch((error) => {
        throw new UnauthorizedException('Unauthorized');
      });
  }
}
