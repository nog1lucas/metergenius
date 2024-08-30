import { Injectable, BadRequestException } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Injectable()
export class MeasureService {
  constructor(private readonly geminiService: GeminiService) {}

  async processUpload(image: string): Promise<{ imageUrl: string; measureValue: string; measureUuid: string }> {
    try {
      // Verifica se a string é uma data URL ou apenas base64 e converte para Buffer
      let base64Data: string;
      if (image.startsWith('data:image/')) {
        base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      } else {
        base64Data = image;
      }

      
      
      // Processa a imagem utilizando o GeminiService
      const result = await this.geminiService.processImage(base64Data);

      console.log("result", result)

      return result
      
      // Simulação de retorno, substitua com lógica adequada conforme resposta da API
      // return {
      //   imageUrl: 'https://example.com/image.jpg',  // Substitua com a URL da imagem retornada (se aplicável)
      //   measureValue,
      //   measureUuid: 'some-unique-id',  // Substitua com o UUID retornado (se aplicável)
      // };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new BadRequestException('Error processing image');
    }
  }
}
