import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  idProduct: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
