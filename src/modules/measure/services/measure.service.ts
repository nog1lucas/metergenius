import { Injectable, BadRequestException, ConflictException, HttpStatus, NotFoundException } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { MeasureRepository} from '../repositories/measure.repository'
import { UploadMeasureDto } from '../dto/upload-measure.dto';
import { ConfirmMeasureDto } from '../dto/confirm-reading.dto';
import { Measure, MeasureType } from '../entities/measure.entity';

@Injectable()
export class MeasureService {
  constructor(
    private readonly measureRepo: MeasureRepository,
    private readonly geminiService: GeminiService,
  ) {}

  async processUpload(uploadMeasureDto: UploadMeasureDto): Promise<any> {

    const { image, customer_code, measure_type, measure_datetime } = uploadMeasureDto;

    
    let base64Data: string;
    if (image.startsWith('data:image/')) {
      base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    } else {
      base64Data = image;
    }
    
    // Verificar se já existe uma leitura para o cliente e tipo de medida
    const exists = await this.measureRepo.isMeasurementExists(customer_code, measure_type, measure_datetime);
    if (exists) {
      console.log("caiu já leitur")
      throw new ConflictException('Leitura do mês já realizada');
    }
    
    try {
      const result = await this.geminiService.processImage(base64Data);

      console.log(result, "acabou")

      const measure = this.measureRepo.create({
        value: parseFloat(result.recognizedValue),
        customer: {id: customer_code},
        type: measure_type,
        image_url: result.imageUri
      })

      await this.measureRepo.save(measure)

      return {
        ...measure,
        image_url: `${result.imageUri}?key=${process.env.GEMINI_API_KEY}`,
      };
    } catch (error) {
      throw error
    }
  }

  async confirmMeasurement(confirmMeasureDto: ConfirmMeasureDto): Promise<any> {
    const { measure_uuid, confirmed_value } = confirmMeasureDto;

    // Encontrar a medida com base no UUID
    const measure = await this.measureRepo.findOneBy({ id: measure_uuid });

    if (!measure) {
      throw new NotFoundException('Leitura não encontrada');
    }

    // Verificar se a medida já foi confirmada
    if (measure.has_confirmed) {
      throw new ConflictException('Leitura já confirmada');
    }

    // Atualizar a medida com o valor confirmado e definir como confirmada
    try {
      measure.value = confirmed_value;
      measure.has_confirmed = true; // Presumindo que você tem um campo `has_confirmed` na entidade Measure para rastrear confirmações
      const updatedMeasure = await this.measureRepo.save(measure);

      return updatedMeasure;
    } catch (error) {
      throw error;
    }
  }


  
  async listMeasures(customerId: string, measureType?: MeasureType): Promise<any> {
    // Verifica se o cliente existe
    const customerExists = await this.measureRepo.checkCustomerExists(customerId);
    if (!customerExists) {
      throw new NotFoundException('Customer not found');
    }

    // Filtra as medidas com base no código do cliente e no tipo de medida (se fornecido)
    const measures = await this.measureRepo.find({
      where: {
        customer: { id: customerId },
        ...(measureType && { type: measureType }), // Aplica o filtro apenas se measureType estiver presente
      },
    });

    return measures;
  }
}
