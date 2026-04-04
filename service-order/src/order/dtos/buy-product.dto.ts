import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BuyProductDto {
  @IsString()
  @IsNotEmpty()
  idProduct: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
