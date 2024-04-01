import { Inject, Injectable } from '@nestjs/common';
import { BookCreateDto } from 'src/dto/book.dto';
import { Book } from 'src/entity/book.entity';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private bookRepository: typeof Book,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.bookRepository.findAndCountAll({
      offset,
      limit,
    });
    return { data: rows, total: count };
  }

  async findById(id: number): Promise<Book> {
    return this.bookRepository.findOne({ where: { id: id } });
  }

  async create(bookDto: BookCreateDto) {
    const { title, writer, coverImage, point, tag } = bookDto;
    return this.bookRepository.create({
      title,
      writer,
      coverImage,
      point,
      tag,
    });
  }
}
