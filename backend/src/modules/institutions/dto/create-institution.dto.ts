import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { InstitutionType } from '@prisma/client';

export class CreateInstitutionDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  slug!: string;

  @IsOptional()
  @IsEnum(InstitutionType)
  type?: InstitutionType;
}
