import {
  Table,
  Column,
  Model,
  Unique,
  IsEmail,
  DataType,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  name: string;

  @IsEmail
  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Column({ type: DataType.FLOAT, defaultValue: 100 })
  point: number;
}
