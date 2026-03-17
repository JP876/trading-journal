import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import withCatch from 'src/utils/withCatch';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider
  ) {}

  public async findOneBy(options: FindOptionsWhere<User>): Promise<User> {
    const [findError, existingUser] = await withCatch(this.usersRepository.findOneBy(options));

    if (findError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: findError.message,
      });
    }
    if (!existingUser) {
      throw new NotFoundException(`User does not exist`);
    }

    return existingUser;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const [findError, existingUser] = await withCatch(
      this.usersRepository.findOne({
        where: { email: createUserDto.email },
      })
    );

    if (findError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: findError.message,
      });
    }
    if (existingUser?.email === createUserDto.email) {
      throw new BadRequestException('The user already exists, please check your email.');
    }

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
    const [saveError, user] = await withCatch(this.usersRepository.save(newUser));

    if (saveError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: saveError.message,
      });
    }

    return user;
  }
}
