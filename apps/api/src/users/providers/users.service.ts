import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import withCatch from 'src/utils/withCatch';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const [findError, existingUser] = await withCatch(
      this.usersRepository.findOne({
        where: { email: createUserDto.email },
      })
    );

    if (findError) {
      throw new BadRequestException(findError);
    }
    if (existingUser?.email === createUserDto.email) {
      throw new BadRequestException('The user already exists, please check your email.');
    }

    const user = this.usersRepository.create({ ...createUserDto });
    const [saveError, savedUser] = await withCatch(this.usersRepository.save(user));

    if (saveError) {
      throw new BadRequestException(saveError);
    }

    return savedUser;
  }
}
