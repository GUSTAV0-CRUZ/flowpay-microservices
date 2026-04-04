import { IsNotEmpty, IsString } from 'class-validator';

export class ReversalProductDto {
  @IsString()
  @IsNotEmpty()
  idProduct: string;
}
