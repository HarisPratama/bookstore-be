import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PayloadUserToken } from 'src/dto/auth.dto';
import { CreateOrderDto, CreateOrderInterface } from 'src/dto/order.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { BookService } from 'src/services/book/book.service';
import { OrderService } from 'src/services/order/order.service';
import { UserService } from 'src/services/user/user.service';

@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private bookService: BookService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('')
  async getOrders(
    @Res() res: Response,
    @Req() req: { user: PayloadUserToken },
  ) {
    try {
      const orders = await this.orderService.getOrdersByUserId(req.user.id);
      res.status(200).json({
        status: 'success',
        data: orders,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderInterface,
    @Req() req: { user: PayloadUserToken },
    @Res() res: Response,
  ) {
    try {
      if (req.user.point >= createOrderDto.bookPoint) {
        const payload: CreateOrderDto = {
          userId: req.user.id,
          bookId: createOrderDto.bookId,
        };
        const user = await this.userService.findById(req.user.id);
        await this.orderService.createOrder(payload);

        const payloadUpdateUserPoint = {
          ...req.user,
          point: user.point - createOrderDto.bookPoint,
        };
        await this.userService.update(payloadUpdateUserPoint);

        res.status(201).json({
          status: 'success',
          data: payloadUpdateUserPoint,
        });
      } else {
        res.status(200).json({
          status: 'failed',
          message: 'Your points have reached the limit',
        });
      }
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async canceledOrder(
    @Param() param: { id: number },
    @Body() book: { point: number },
    @Req() req: { user: PayloadUserToken },
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.findById(req.user.id);
      const payloadUpdateUserPoint = {
        ...req.user,
        point: +user.point + +book.point,
      };

      await this.userService.update(payloadUpdateUserPoint);

      await this.orderService.canceledOrder(param.id, req.user.id);
      res.status(201).json({
        status: 'success',
        message: 'Success canceled order',
        data: payloadUpdateUserPoint,
        book: book.point,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }
}
