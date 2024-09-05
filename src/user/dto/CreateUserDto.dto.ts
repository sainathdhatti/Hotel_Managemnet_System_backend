import { IsString, IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  aadharCardNumber: string;
}
