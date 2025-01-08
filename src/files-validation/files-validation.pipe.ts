import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { extname, join } from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  private readonly maxFileSize = 5 * 1000000; // 5 MB
  private readonly allowedExtensions = ['.png', '.jpg'];

  // Delete file
  removeFile(value: any, message: string) {
    fs.unlink(join(__dirname + '/../../public/' + value.filename), (err) => {
      if (err) throw err;
      console.log(`${value.filename} is deleted`);
    });

    value['status'] = {
      message: message,
      error: 'Bad Request',
      statusCode: 400,
    };
  }

  transform(value: Array<any>, metadata: ArgumentMetadata) {
    const extensions = value.map((val) => extname(val.originalname));
    const fileSizes = value.map((val) => val.size);

    fileSizes.forEach((fileSize, index) => {
      const extension = extensions[index];

      if (!this.allowedExtensions.includes(extension)) {
        this.removeFile(
          value[index],
          `File type ${extension} is not supported`,
        );
      }

      if (fileSize > this.maxFileSize) {
        this.removeFile(value[index], `File size is too large`);
      }
    });

    return value;
  }
}
