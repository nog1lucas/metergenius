import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseFilters,
  Patch,
  Get,
  HttpException,
  Param,
  Query,
} from '@nestjs/common';
import { MeasureService } from './services/measure.service';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { DoubleReportFilter } from './filters/double-report.filter'
import { InvalidDataFilter } from './filters/invalid-data.filter'
import { MeasureNotFoundFilter } from './filters/measure-not-found.filter'
import { ConfirmationDuplicateFilter } from './filters/confirmation-duplicate.filter'
import { Measure, MeasureType } from './entities/measure.entity';
import { ConfirmMeasureDto } from './dto/confirm-reading.dto';

@Controller('measures')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  @UseFilters(
    DoubleReportFilter, 
    InvalidDataFilter
  )
  @HttpCode(HttpStatus.OK)
  async uploadImage(@Body() uploadMeasureDto: UploadMeasureDto) {      
     const measure: Measure = await this.measureService.processUpload(uploadMeasureDto);

     return {
      image_url: measure.image_url,
      measure_value: measure.value,
      measure_uuid: measure.id,
    };
  }

  @Patch('confirm')
  @UseFilters(
    MeasureNotFoundFilter,
    ConfirmationDuplicateFilter,
  )
  @HttpCode(HttpStatus.OK)
  confirmMeasurement(@Body() confirmMeasureDto: ConfirmMeasureDto) {     
     this.measureService.confirmMeasurement(confirmMeasureDto);
     return { success: true }
  }

  @Get(':customerId/list')
  async listMeasures(
    @Param('customerId') customerId: string,
    @Query('measure_type') measureType?: string // Recebe como string
  ) {
    try {
      // Converte o valor da query para minúsculas
      const normalizedMeasureType = measureType?.toLowerCase();

      // Verifica se o valor convertido é um valor válido do enum
      if (normalizedMeasureType && !Object.values(MeasureType).includes(normalizedMeasureType as MeasureType)) {
        throw new HttpException(
          {
            error_code: 'INVALID_MEASURE_TYPE',
            error_description: 'measure_type must be WATER or GAS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Passa o valor normalizado para o serviço
      return await this.measureService.listMeasures(customerId, normalizedMeasureType as MeasureType);
    } catch (error) {
      throw new HttpException(
        {
          error_code: 'LIST_FAILED',
          error_description: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
