import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { MeasureService } from './services/measure.service';
import { UploadReadingDto } from './dto/upload-reading.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('measures')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  async uploadImage(@Body() uploadReadingDto: UploadReadingDto) {
    try {
      const result = await this.measureService.processUpload(uploadReadingDto.image);
      /*return {
        image_url: result.imageUrl,
        measure_value: result.measureValue,
        measure_uuid: result.measureUuid,
      };*/
    } catch (error) {
      throw new HttpException(
        {
          error_code: 'UPLOAD_FAILED',
          error_description: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
