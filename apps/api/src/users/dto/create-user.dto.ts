import { SubscriptionType } from '@prisma/client';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;             // obligatoire
  @IsEmail()
  email!: string;            // obligatoire
  @IsString()
  @MinLength(6)
  password!: string;         // obligatoire
}
