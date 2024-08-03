import {
  Controller,
  Get,
  Body,
  Param,
  Query,
  Delete,
  NotFoundException,
  UseInterceptors,
  BadRequestException,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUserDto } from './dto/pagination-user.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  Auth,
  BasicErrorSchema,
  BasicSuccessSchema,
  ErrorMessageSchema,
  IPaginationResponse,
  Permission,
  paginationSchemaFactory,
  validationErrorSchemaFactory,
} from '@app/common';
import { User } from './entities/user.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UserDto } from './dto/user.dto';
import { UpdateProfileErrorValidationDto } from './dto/update-profile-error-validation.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('get-all-users')
  @CacheTTL(30)
  @Permission('get all users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'get all users with pagination',
    type: paginationSchemaFactory(UserDto),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  findAllPagination(
    @Query() findQuery: PaginationUserDto,
  ): Promise<IPaginationResponse<User>> {
    return this.usersService.findAllPagination(findQuery);
  }

  @Get('profile')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Permission('get user profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({
    description: 'Get user profile',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  detailProfile(@Auth() user: User): User {
    return user;
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Permission('get user by id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({
    description: 'Get user by id',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  @Patch('update-profile')
  @Permission('update profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({
    description: 'Update profile success',
    type: BasicSuccessSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(UpdateProfileErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async update(
    @Auth() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BasicSuccessSchema> {
    const result = await this.usersService.update(user.id, updateUserDto);
    if (!result) throw new BadRequestException('Update profile failed');

    return { message: 'Update profile success' };
  }

  @Delete(':id')
  @Permission('delete user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({
    description: 'Delete user success',
    type: BasicSuccessSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BasicSuccessSchema> {
    await this.usersService.deleteById(id);

    return { message: `user with id ${id} has been deleted` };
  }
}
