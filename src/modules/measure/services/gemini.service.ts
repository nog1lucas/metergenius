import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import * as path from 'path'
import { promises as fs } from 'fs';
import { error } from 'console';

interface UploadResponse {
  file: {
    name: string;
    mimeType: string;
    uri: string;
    displayName?: string;
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

  private async uploadImage(base64Image: string): Promise<UploadResponse> {
    const tempFilePath = path.join(__dirname, 'temp_image.jpg');
    await fs.writeFile(tempFilePath, Buffer.from(base64Image, 'base64'));

    try {
      const uploadResponse = await this.fileManager.uploadFile(tempFilePath, {
        mimeType: 'image/jpeg',
        displayName: 'Uploaded Image',
      });
      return uploadResponse;
    } finally {
      await fs.unlink(tempFilePath); // Limpeza do arquivo temporário
    }
  }

  private async getFileMetadata(fileName: string): Promise<any> {
    return this.fileManager.getFile(fileName);
  }

  /**
   * Sanitizes the extracted value by removing non-numeric characters.
   * @param value Extracted value from the image.
   * @returns Sanitized numeric value or null if invalid.
   */
  private sanitizeValue(value: string): number | null {
    value = value.trim()
    const numericValue = value.replace(/[^\d]/g, '');

    if (numericValue === '') {
      return null; // No numeric digits found
    }

    const parsedValue = parseInt(numericValue, 10);
    return isNaN(parsedValue) ? null : parsedValue;
  }

  private async generateContent(fileUri: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    Analyze the provided image, which shows a water or gas meter, and extract the numeric consumption value displayed on the meter.
    The value should be the exact reading shown on the meter, without any additional text or formatting.
    The image may show either an analog or digital meter, so identify and extract the number as accurately as possible.
    If the image includes measurement units, such as cubic meters or liters for water, or cubic meters for gas, ignore these units and return only the numeric value.
    If it is not possible to identify the value, return a message indicating a failure to read.
  `;

    const result = await model.generateContent([
      { fileData: { mimeType: 'image/jpeg', fileUri } },
      { text: prompt },
    ]);

    const recognizedValue = result.response.text();
    const sanitizedValue = this.sanitizeValue(recognizedValue);

    if (sanitizedValue === null) {
      throw new BadRequestException(recognizedValue);
    }

    return recognizedValue
  }

  /**
   * Processes the image by uploading it, retrieving metadata, and generating content.
   * @param base64Image Base64 encoded image to be processed.
   * @returns Object containing image URI and recognized value.
   */
  async processImage(base64Image: string): Promise<any> {
    try {
      const uploadResponse = await this.uploadImage(base64Image);
      const fileMetadata = await this.getFileMetadata(uploadResponse.file.name);

      const resultText = await this.generateContent(fileMetadata.uri);

      return {
        imageUri: fileMetadata.uri,
        recognizedValue: resultText,
      };
    } catch (error) {
      throw error
    }
  }
}
