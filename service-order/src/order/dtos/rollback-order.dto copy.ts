import { IsNotEmpty, IsString } from 'class-validator';

export class RollbackOrderDto {
  @IsString()
  @IsNotEmpty()
  idProduct: string;
}
