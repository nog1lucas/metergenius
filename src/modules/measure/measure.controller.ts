import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { MeasureService } from './services/measure.service';
import { UploadReadingDto } from './dto/upload-reading.dto';

@Controller('measures')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  async uploadImage(@Body() uploadReadingDto: UploadReadingDto) {
    try {
      // Chamando o serviço para processar o upload da imagem e obter a medida
     return await this.measureService.processUpload(uploadReadingDto.image);
    } catch (error) {

      // throw new BadRequestException({
      //   error_code: 'INVALID_DATA',
      //   error_description: "Os dados fornecidos no corpo da requisição são inválidos"
      // });
      // throw new ConflictException({
      //   error_code: 'DOUBLE_REPORT',
      //   error_description: ""Leitura do mês já realizada"  
      //});
    }
    }

  //   @Patch('confirm')
  //   async confirmReading(@Body() confirmReadingDto: ConfirmReadingDto) {
  //     try {
  //       const result = await this.measureService.confirmReading(confirmReadingDto);
  //       return {
  //         success: true,
  //       };
  //     } catch (error) {
  //       throw new HttpException(
  //         {
  //           error_code: 'CONFIRMATION_FAILED',
  //           error_description: error.message,
  //         },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }

  //   @Get(':customerCode/list')
  //   async listReadings(@Param('customerCode') customerCode: string, @Query('measure_type') measureType?: string) {
  //     try {
  //       return await this.measureService.listReadings(customerCode, measureType);
  //     } catch (error) {
  //       throw new HttpException(
  //         {
  //           error_code: 'LIST_FAILED',
  //           error_description: error.message,
  //         },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }
}
