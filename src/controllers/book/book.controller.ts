import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { BookService } from 'src/services/book/book.service';
import { Response } from 'express';
import { BookCreateDto } from 'src/dto/book.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('')
  async getBooks(
    @Res() res: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    try {
      const books = await this.bookService.findAll(page, limit);
      res.status(200).json({
        status: 'success',
        data: books,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @Post('')
  async createBook(@Body() body: BookCreateDto, @Res() res: Response) {
    try {
      await this.bookService.create(body);
      res.status(200).json({
        status: 'success',
        message: body,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @Get(':id')
  async getBook(@Param() params: { id: number }, @Res() res: Response) {
    try {
      const book = await this.bookService.findById(params.id);
      res.status(200).json({
        status: 'success',
        data: book,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }
}
