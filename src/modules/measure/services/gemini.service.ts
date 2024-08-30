import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import * as path from 'path'
import { promises as fs } from 'fs';

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

  private async checkForExistingReading(month: string, readingType: string): Promise<void> {
    // Implementar a lógica para verificar leituras existentes no mês atual para o tipo de leitura
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

  private async generateContent(fileUri: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = "Extract the value from the image";

    const result = await model.generateContent([
      { fileData: { mimeType: 'image/jpeg', fileUri } },
      { text: prompt },
    ]);


    console.log("result", result.response)
    return result.response.text();
  }

  async processImage(base64Image: string): Promise<any> {
    // Exemplo de chamada para verificar leituras existentes
    // await this.checkForExistingReading('current_month', 'reading_type');

    try {
      const uploadResponse = await this.uploadImage(base64Image);
      const fileMetadata = await this.getFileMetadata(uploadResponse.file.name);

      console.log(`Retrieved file ${fileMetadata.displayName} as ${fileMetadata.uri}`);

      const resultText = await this.generateContent(fileMetadata.uri);
      console.log('Content generation result:', resultText);

      return {
        imageUri: fileMetadata.uri,
        guid: uploadResponse.file.name, // Usando o name como GUID
        recognizedValue: resultText,
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new BadRequestException('Failed to process image');
    }
  }
}
