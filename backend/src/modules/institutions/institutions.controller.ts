import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';

@Controller('institutions')
export class InstitutionsController {
  constructor(private institutions: InstitutionsService) {}

  @Get()
  findAll() {
    return this.institutions.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  create(@Body() dto: CreateInstitutionDto) {
    return this.institutions.create(dto);
  }
}
