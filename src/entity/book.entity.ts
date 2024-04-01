import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Book extends Model<Book> {
  @Column
  title: string;

  @Column
  writer: string;

  @Column
  coverImage: string;

  @Column(DataType.FLOAT)
  point: number;

  @Column
  tag: string;
}
