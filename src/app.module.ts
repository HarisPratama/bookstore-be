import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BookService } from './services/book/book.service';
import { UserService } from './services/user/user.service';
import { HashingService } from './helpers/hashing/hashing.service';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.constants';
import { usersProviders } from './repository/user/user.providers';
import { booksProviders } from './repository/book/book.providers';
import { BookController } from './controllers/book/book.controller';
import { orderProviders } from './repository/order/order.providers';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AppController, AuthController, BookController, OrderController],
  providers: [
    AppService,
    BookService,
    UserService,
    HashingService,
    ...usersProviders,
    ...booksProviders,
    ...orderProviders,
    OrderService,
  ],
})
export class AppModule {}
