import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: "Adresse email invalide" })
  email!: string;

  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  password!: string;

  @IsString({ message: "Le nom d'utilisateur doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le nom d'utilisateur est obligatoire" })
  name!: string;
}
