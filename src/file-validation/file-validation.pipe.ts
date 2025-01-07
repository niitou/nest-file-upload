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
