import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PayloadUserToken } from 'src/dto/auth.dto';
import { LoginDto, UserCreateDto } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { HashingService } from 'src/helpers/hashing/hashing.service';
import { UserService } from 'src/services/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly hashingService: HashingService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('current-user')
  async getUserProfile(
    @Req() req: { user: PayloadUserToken },
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.findById(req.user.id);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @Post('register')
  async register(@Body() body: UserCreateDto, @Res() res: Response) {
    try {
      const { email, password, name } = body;
      const hashPass = await this.hashingService.encrypt(password);

      const findUserByUsername = await this.userService.findByEmail(email);

      if (findUserByUsername && findUserByUsername.name) {
        res.status(200).json({
          status: 'Error',
          message: 'User already registered',
        });
      } else {
        const FindUserDto = {
          email,
          password: hashPass,
          name,
        };

        const createUser = await this.userService.create(FindUserDto);
        res.status(201).json({
          status: 'Success',
          data: {
            name: createUser.name,
            email: createUser.email,
            point: createUser.point,
          },
        });
      }
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { email, password } = body;

    const findUser = await this.userService.findByEmail(email);

    if (findUser && findUser.email) {
      const comparePass = await this.hashingService.compare(
        password,
        findUser.password,
      );

      if (comparePass) {
        const payload: PayloadUserToken = {
          email: findUser.email,
          name: findUser.name,
          id: findUser.id,
          point: findUser.point,
        };

        const accessToken = await this.jwtService.signAsync(payload);
        res.status(200).json({
          status: 'Sukses',
          data: payload,
          accessToken,
        });
      } else {
        res.status(401).json({
          status: 'Unauthorized',
          message: 'Wrong password/email',
        });
      }
    } else {
      res.status(404).json({
        status: 'Not Found',
        message: 'User not found',
      });
    }
  }
}
