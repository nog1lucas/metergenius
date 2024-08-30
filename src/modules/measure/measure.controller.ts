import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { MeasureService } from './services/measure.service';
import { UploadMeasureDto } from './dto/upload-measure.dto';

@Controller('measures')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  async uploadImage(@Body() uploadMeasureDto: UploadMeasureDto) {
    console.log("bateu")
     return await this.measureService.processUpload(uploadMeasureDto);
  }

  @Get('teste')
  async teste() {
    console.log("bateu")
  }
      // throw new BadRequestException({
      //   error_code: 'INVALID_DATA',
      //   error_description: "Os dados fornecidos no corpo da requisição são inválidos"
      // });

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
