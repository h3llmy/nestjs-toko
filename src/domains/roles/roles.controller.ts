import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
  BasicErrorSchema,
  BasicSuccessSchema,
  paginationSchemaFactory,
  Permission,
  validationErrorSchemaFactory,
} from '@app/common';
import { DeepPartial } from 'typeorm';
import { Role } from './entities/role.entity';
import { RoleDto } from './dto/role.dto';
import { CreateRoleErrorValidationDto } from './dto/create-role-error-validation.dto';
import { UpdateRoleErrorValidationDto } from './dto/update-role-error-validation.dto';
import { PaginationRoleDto } from './dto/pagination-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permission('create role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new role' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: RoleDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed',
    type: validationErrorSchemaFactory(CreateRoleErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  create(@Body() createRoleDto: CreateRoleDto): Promise<DeepPartial<Role>> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permission('get all roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record has been successfully created.',
    type: paginationSchemaFactory(RoleDto),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  findAll(@Query() findQuery: PaginationRoleDto) {
    return this.rolesService.findAll(findQuery);
  }

  @Get(':id')
  @Permission('get role by id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get role by id' })
  @ApiParam({ name: 'id', description: 'Role id' })
  @ApiOkResponse({
    description: 'Get role by id',
    type: RoleDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.rolesService.findOne(id);

    if (!result) throw new NotFoundException('Role not found');

    return result;
  }

  @Patch(':id')
  @Permission('update role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update role by id' })
  @ApiParam({ name: 'id', description: 'Role id' })
  @ApiOkResponse({
    description: 'Update role by id',
    type: RoleDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed',
    type: validationErrorSchemaFactory(UpdateRoleErrorValidationDto),
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const result = await this.rolesService.update(id, updateRoleDto);
    if (!result) throw new NotFoundException('Role not found');

    return result;
  }

  @Delete(':id')
  @Permission('delete role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete role by id' })
  @ApiParam({ name: 'id', description: 'Role id' })
  @ApiOkResponse({
    description: 'Delete role by id',
    type: BasicSuccessSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.rolesService.remove(id);
    if (!result) throw new NotFoundException('Role not found');

    return { message: `Role with id ${id} has been deleted` };
  }
}
