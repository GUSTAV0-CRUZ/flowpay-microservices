import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveProductDto {
  @IsString()
  @IsNotEmpty()
  idProduct: string;
}
