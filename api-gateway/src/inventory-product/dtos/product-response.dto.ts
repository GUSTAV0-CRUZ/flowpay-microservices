import { ApiProperty } from '@nestjs/swagger';
import { StatusProductEnum } from '../enums/status-product.enum';

export class ProductResponseDto {
  @ApiProperty({ example: '69cbf8c78638337c910bee74' })
  _id: string;

  @ApiProperty({ example: 'tv' })
  name: string;

  @ApiProperty({ example: 2000 })
  price: number;

  @ApiProperty({ example: StatusProductEnum.AVAILABLE })
  status: StatusProductEnum;

  @ApiProperty({ example: 'codeOfProduct12' })
  code: string;

  createdtAt: Date;
  updatedAt: Date;
}
