import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmMeasureDto {
  @IsString()
  @IsNotEmpty()
  measure_uuid: string;

  @IsNumber()
  @IsNotEmpty()
  confirmed_value: number
}
