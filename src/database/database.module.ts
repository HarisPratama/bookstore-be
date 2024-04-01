import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Book } from 'src/entity/book.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';

const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(
        'postgres://zkspzpjg:G8gP4rE3b2KjOHfazgSW9LJb_23gMcxS@arjuna.db.elephantsql.com/zkspzpjg',
      );
      sequelize.addModels([User, Book, Order]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
