import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bucket } from '@google-cloud/storage';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private bucket: Bucket;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.configService.get('FIREBASE_PRIVATE_KEY'),
      }),
      storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
    });

    this.bucket = admin.storage().bucket();
  }

  async handleFileUpload(
    fileName: string,
    contentType: string,
    buffer: Buffer,
  ) {
    try {
      const file = this.bucket.file(fileName);
      const writeStream = file.createWriteStream({
        metadata: { contentType },
      });

      writeStream.end(buffer);
      await new Promise<void>((resolve, reject) => {
        writeStream
          .on('error', (error) => reject(error))
          .on('finish', () => resolve());
      });

      const url = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
      });

      return url[0];
    } catch (error) {
      throw new BadRequestException(`Error upload file ${fileName}.`);
    }
  }

  async deleteUploadedFile(fileName: string): Promise<any> {
    try {
      const file = this.bucket.file(fileName);
      return file.delete();
    } catch (error) {
      throw new BadRequestException(`Error deleting file ${fileName}.`);
    }
  }
}
