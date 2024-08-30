import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { MeasureRepository} from '../repositories/measure.repository'
import { UploadMeasureDto } from '../dto/upload-measure.dto';

@Injectable()
export class MeasureService {
  constructor(
    private readonly measureRepo: MeasureRepository,
    private readonly geminiService: GeminiService,
  ) {}

  async processUpload(uploadMeasureDto: UploadMeasureDto): Promise<any> {

    const { image, customer_code, measure_type } = uploadMeasureDto;

    
    let base64Data: string;
    if (image.startsWith('data:image/')) {
      base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    } else {
      base64Data = image;
    }
    
    // Verificar se já existe uma leitura para o cliente e tipo de medida
    const exists = await this.measureRepo.isMeasurementExists(customer_code, measure_type);
    if (exists) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: "Leitura do mês já realizada"  
      });
    }
    
    try {
      const result = await this.geminiService.processImage(base64Data);

      this.measureRepo.create({
        consumption_value: parseFloat(result.recognizedValue),
        customer: {id: customer_code},
        type: measure_type,
      })
      
      await this.measureRepo.save(result)
      
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
