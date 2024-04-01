import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Book } from './book.entity';

@Table
export class Order extends Model<Order> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @BelongsTo(() => Book)
  book: Book;

  @Column({
    type: DataType.ENUM('in-progress', 'success', 'canceled', 'failed'),
    defaultValue: 'in-progress',
  })
  status: string;
}
