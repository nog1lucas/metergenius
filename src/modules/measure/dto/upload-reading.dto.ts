import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export enum MeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}

export class UploadReadingDto {
  @IsString()
  @IsNotEmpty()
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
