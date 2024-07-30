import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(@Query() findQuery: any) {
    return this.permissionsService.findAll(findQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put('roles/:id')
  updateRoles(@Param('id') id: string, @Body() updatePermissionsRolesDto: any) {
    return this.permissionsService.updateRoles(id, updatePermissionsRolesDto);
  }
}
