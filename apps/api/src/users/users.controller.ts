import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  UseGuards, 
  Request,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Créer un utilisateur (obligatoire : nom, email, mot de passe)
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body.name, body.email, body.password);
  }

  // ✅ IMPORTANT : Les routes spécifiques (/me, /change-password, /settings) DOIVENT être AVANT les routes dynamiques (/:id)
  
  // ✅ Récupérer le profil de l'utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    return this.usersService.getUser(req.user.id);
  }

  // ✅ Mettre à jour le profil (nom et/ou email)
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @Request() req: any,
    @Body() body: { name?: string; email?: string }
  ) {
    const userId = req.user.id;

    // Validation
    if (!body.name && !body.email) {
      throw new BadRequestException('Aucune donnée à mettre à jour');
    }

    // Vérifier disponibilité du nom si changé
    if (body.name) {
      const nameExists = await this.usersService.checkUsernameExists(body.name, userId);
      if (nameExists) {
        throw new BadRequestException('Ce nom d\'utilisateur est déjà pris');
      }
    }

    // Vérifier disponibilité de l'email si changé
    if (body.email) {
      const emailExists = await this.usersService.checkEmailExists(body.email, userId);
      if (emailExists) {
        throw new BadRequestException('Cet email est déjà utilisé');
      }
    }

    return this.usersService.updateUser(userId, body);
  }

  // ✅ Changer le mot de passe
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const userId = req.user.id;

    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Mots de passe manquants');
    }

    if (body.newPassword.length < 8) {
      throw new BadRequestException('Le nouveau mot de passe doit contenir au moins 8 caractères');
    }

    // Vérifier l'ancien mot de passe
    const isValid = await this.usersService.verifyPassword(userId, body.currentPassword);
    if (!isValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    // Mettre à jour le mot de passe
    await this.usersService.updatePassword(userId, body.newPassword);

    return { message: 'Mot de passe modifié avec succès' };
  }

  // ✅ Récupérer les paramètres utilisateur
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async getSettings(@Request() req: any) {
    return this.usersService.getUserSettings(req.user.id);
  }

  // ✅ Mettre à jour les paramètres utilisateur
  @UseGuards(JwtAuthGuard)
  @Patch('settings')
  async updateSettings(
    @Request() req: any,
    @Body() settings: { darkMode?: boolean; language?: string; currency?: string }
  ) {
    return this.usersService.updateUserSettings(req.user.id, settings);
  }

  // ⚠️ Routes dynamiques en DERNIER (sinon /me sera capturé par /:id)
  
  // Récupérer tous les utilisateurs
  @Get()
  findAll() {
    return this.usersService.getAllUsers();
  }

  // Récupérer un utilisateur par ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUser(Number(id));
  }
}
