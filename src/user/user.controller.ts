import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        data: null,
      };
    }

    return {
      success: true,
      message: 'User information retrieved successfully',
      data: user.toObject(),
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);

    if (!updatedUser) {
      return {
        success: false,
        message: 'User not found',
        data: null,
      };
    }

    return {
      success: true,
      message: 'User information updated successfully',
      data: updatedUser,
    };
  }
}
