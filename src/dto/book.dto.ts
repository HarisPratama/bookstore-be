import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BookCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  writer: string;

  @IsNotEmpty()
  @ApiProperty()
  coverImage: string;

  @IsNotEmpty()
  @ApiProperty()
  point: number;

  @IsNotEmpty()
  @ApiProperty()
  tag: string;
}
