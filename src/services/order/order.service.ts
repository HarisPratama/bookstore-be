import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/dto/order.dto';
import { Book } from 'src/entity/book.entity';
import { Order } from 'src/entity/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDERS_REPOSITORY') private orderRepository: typeof Order,
  ) {}

  async findById(id: number) {
    return this.orderRepository.findOne({ where: { id } });
  }

  async getOrdersByUserId(userId: number) {
    return this.orderRepository.findAll({
      where: { userId },
      include: [{ model: Book }],
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.orderRepository.create(createOrderDto);
  }

  async canceledOrder(orderId: number, userId: number) {
    return this.orderRepository.destroy({
      where: { id: orderId, userId },
    });
  }
}
