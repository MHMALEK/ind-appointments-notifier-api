import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';
import * as path from 'path';

@Global()
@Module({})
export class FirebaseModule {
  constructor(private configService: ConfigService) {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert({
          projectId: this.configService.get('PROJECT_ID'),
        }),
      });
    }
  }
}
