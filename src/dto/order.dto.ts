// create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  bookId: number;
}

export class CreateOrderInterface {
  bookId: number;
  bookPoint: number;
}
