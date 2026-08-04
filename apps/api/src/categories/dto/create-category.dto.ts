import { IsHexColor, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  slug!: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
