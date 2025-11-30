import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  email!: string;     // le '!' dit à TS que ça sera initialisé
  password!: string;
  name!: string;      // si tu utilises le nom
}
