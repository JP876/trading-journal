import { BadRequestException, Body, Controller, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { UpdateUserDto } from './dtos/update-user-dto';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { UserService } from './providers/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  public async update(@Body() updateDto: UpdateUserDto, @Req() request: RequestWithUser) {
    const id = request.user._id as string;
    return this.userService.update(id, updateDto);
  }

  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fieldSize: 2097152 }, // 2MB
      fileFilter: (req, file, callback) => {
        return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
          ? callback(null, true)
          : callback(new BadRequestException('Only image files are allowed'), false);
      },
    })
  )
  public async updateAvatar(@Req() request: RequestWithUser, @UploadedFile() avatar: Express.Multer.File) {
    const id = request.user._id as string;
    return this.userService.updateAvatar(id, avatar);
  }
}
