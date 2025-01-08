import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { extname, join } from 'path';
import * as fs from 'fs';
@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxFileSize = 10 * 1000000; // 10 MB
  private readonly allowedExtensions = ['.png', '.jpg', '.mp4'];

  // Delete file
  removeFile(value: any, message: string) {
    fs.unlink(join(__dirname + '/../../public/' + value.filename), (err) => {
      if (err) throw err;
      console.log(`${value.filename} is deleted`);
    });
    throw new BadRequestException(message);
  }

  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    const extension = extname(value.originalname);
    const fileSize = value.size;
    if (!this.allowedExtensions.includes(extension)) {
      this.removeFile(value, `File type ${extension} is not supported`);
    }

    if (fileSize > this.maxFileSize) {
      this.removeFile(value, `File size is too large`);
    }

    return value;
  }
}
