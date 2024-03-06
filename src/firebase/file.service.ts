import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import {
  getPathStorageFromUrl,
  separateFilenameAndExtension,
} from 'src/shared/utils';

@Injectable()
export class FileService {
  constructor(private firebaseService: FirebaseService) {}

  async uploadFile(originalName: string, mimeType: string, file: Buffer) {
    // preprocess original file name: add timestamp to end of file name
    const { fileName, fileExt } = separateFilenameAndExtension(originalName);
    const newFileName = `${
      fileName ? fileName : 'file'
    }-${Date.now()}.${fileExt}`;

    const url = await this.firebaseService.handleFileUpload(
      newFileName,
      mimeType,
      file,
    );

    return {
      fileName: newFileName,
      url: url,
    };
  }

  async deleteFile(fileUrl: string) {
    const fileName = getPathStorageFromUrl(fileUrl);
    return this.firebaseService.deleteUploadedFile(fileName);
  }
}
