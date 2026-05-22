import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
