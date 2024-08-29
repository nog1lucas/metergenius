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
  customerCode: string; 

  @IsDateString()
  @IsNotEmpty()
  measureDatetime: string; 

  @IsEnum(MeasureType)
  @IsNotEmpty()
  measureType: MeasureType;
}
