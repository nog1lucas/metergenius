import { IsString, IsNotEmpty, IsDateString, IsEnum, Matches, IsNumber } from 'class-validator';
import { IsBase64OrDataUri } from '../../../common/decorators/is-base64-or-datauri.decorator';
import { MeasureType } from '@/modules/customer/entities/reading.entity';

export class UploadReadingDto {
  @IsNumber()
  @IsNotEmpty()
  @IsBase64OrDataUri({
    message: 'The image field must be a valid Base64 or data URI',
  })
  image: string;

  @IsString()
  @IsNotEmpty()
  customer_code: string;

  @IsDateString()
  @IsNotEmpty()
  measure_datetime: string;

  @IsEnum(MeasureType)
  @IsNotEmpty()
  measure_type: MeasureType;
}
