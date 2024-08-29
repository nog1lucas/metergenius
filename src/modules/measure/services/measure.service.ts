import { Injectable, BadRequestException } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Injectable()
export class MeasureService {
  constructor(private readonly geminiService: GeminiService) {}

  async processUpload(image: string): Promise<string> {
    try {
      // Verifica se a string é uma data URL ou apenas base64
      let base64Data: string;
      if (image.startsWith('data:image/')) {
        base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      } else {
        base64Data = image;
      }

      const imageBuffer = Buffer.from(base64Data, 'base64');

      await this.geminiService.processImage(imageBuffer);

      return 'Image processed successfully';
    } catch (error) {
      console.error('Error processing image:', error);
      throw new BadRequestException('Error processing image');
    }
  }

  findAll(): string {
    return 'This action returns all customers';
  }

  findOne(id: number): string {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: any): string {
    return `This action updates a #${id} customer`;
  }

  remove(id: number): string {
    return `This action removes a #${id} customer`;
  }
}
