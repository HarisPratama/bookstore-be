import { Inject, Injectable } from '@nestjs/common';
import { UserCreateDto, UserUpdateDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_REPOSITORY') private userRepository: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
  }

  async create(userDto: UserCreateDto) {
    const { email, password, name } = userDto;
    return this.userRepository.create({ email, password, name });
  }

  async update(userDto: UserUpdateDto) {
    const { email, name, point } = userDto;
    return this.userRepository.update(
      { name, email, point },
      {
        where: { id: userDto.id },
      },
    );
  }
}
