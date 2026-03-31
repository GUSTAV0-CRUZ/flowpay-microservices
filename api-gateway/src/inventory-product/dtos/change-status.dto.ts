import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusProductEnum } from '../enums/status-product.enum';

export class ChangeStatusDto {
  @IsEnum(StatusProductEnum)
  @IsNotEmpty()
  status: StatusProductEnum;
}
