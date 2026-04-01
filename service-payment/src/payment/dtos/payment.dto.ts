import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsMongoId()
  idProduct: string;
}
