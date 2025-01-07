import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxFileSize = 10 * 1000000; // 10 MB
  private readonly allowedExtensions = ['.png', '.jpg', '.mp4'];

  transform(value: any, metadata: ArgumentMetadata) {
    const extension = extname(value.originalname);
    const fileSize = value.size;
    if (!this.allowedExtensions.includes(extension)) {
      throw new BadRequestException(`File type ${extension} is not supported`)
    }

    if (fileSize > this.maxFileSize) {
      throw new BadRequestException(`File size is too large`)
    }

    return value
  }
}

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  private readonly maxFileSize = 5 * 1000000; // 5 MB
  private readonly allowedExtensions = ['.png', '.jpg'];

  transform(value: Array<any>, metadata: ArgumentMetadata) {
    const extensions = value.map(val => extname(val.originalname))
    const fileSizes = value.map(val => val.size)

    fileSizes.forEach((fileSize, index) => {
      const extension = extensions[index]

      if (!this.allowedExtensions.includes(extension)) {
        throw new BadRequestException(`File type ${extension} is not supported`)
      }

      if (fileSize > this.maxFileSize) {
        throw new BadRequestException(`File size is too large`)
      }
    });

    return value
  }
}