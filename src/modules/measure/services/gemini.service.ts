import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { promises as fs } from 'fs';
import * as path from 'path';

interface UploadResponse {
  file: {
    name: string;
    mimeType: string;
    uri: string;
    displayName?: string;
  };
}

interface GenerateContentResponse {
  response: {
    text: () => string;
  };
}

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly fileManager: GoogleAIFileManager;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')!;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.fileManager = new GoogleAIFileManager(apiKey);
  }

  private async saveToTempFile(imageBuffer: Buffer): Promise<string> {
    const tempFilePath = path.join(__dirname, 'temp_image.jpg');
    await fs.writeFile(tempFilePath, imageBuffer);
    return tempFilePath;
  }

  private async deleteTempFile(tempFilePath: string): Promise<void> {
    await fs.unlink(tempFilePath);
  }

  private async uploadFile(tempFilePath: string): Promise<UploadResponse> {
    return this.fileManager.uploadFile(tempFilePath, { mimeType: 'image/jpeg' });
  }

  private async getFileMetadata(fileName: string): Promise<any> {
    return this.fileManager.getFile(fileName);
  }

  private async generateContent(fileUri: string): Promise<any> {
    const model = await this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    return model.generateContent([
      {
        fileData: {
          mimeType: 'image/jpeg',
          fileUri: fileUri,
        },
      },
      {
        text: "Obtain the names in picture",
      },
    ]);
  }

  async processImage(imageBuffer: Buffer): Promise<any> {
    try {
      // Define MIME type as image/jpeg
      const mimeType = 'image/jpeg';
      
      // Save the image buffer to a temporary file
      const tempFilePath = await this.saveToTempFile(imageBuffer);

      // Upload the file and get response
      const uploadResponse = await this.uploadFile(tempFilePath);

      // Delete the temporary file
      await this.deleteTempFile(tempFilePath);

      // Get file metadata
      const fileMetadata = await this.getFileMetadata(uploadResponse.file.name);

      console.log(`Retrieved file ${fileMetadata.displayName} as ${fileMetadata.uri}`);

      // Generate content based on the uploaded file
      const result = await this.generateContent(uploadResponse.file.uri);

      console.log("Content generation result:", result);
      
      return result.response.text();

    } catch (error) {
      console.error('Error processing image:', error);
      throw new BadRequestException('Failed to process image');
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
