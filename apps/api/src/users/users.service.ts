import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { SubscriptionType } from '@prisma/client';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  // Créer un utilisateur
  async createUser(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { name, email, password: hashedPassword, subscription: 'FREE' },
    });
  }

  // Récupérer un utilisateur par ID (avec ses plans)
  async getUser(id: number) {
    return this.prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        subscription: true,
        plans: true,
        // Ne PAS retourner le mot de passe !
      }
    });
  }
 
  // Récupérer tous les utilisateurs (avec leurs plans)
  async getAllUsers() {
    return this.prisma.user.findMany({ 
      select: {
        id: true,
        name: true,
        email: true,
        subscription: true,
        plans: true,
      }
    });
  }

  // ✅ NOUVEAU : Vérifier si un nom d'utilisateur existe (sauf pour l'utilisateur actuel)
  async checkUsernameExists(name: string, excludeUserId?: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        name: name.toLowerCase(),
        ...(excludeUserId && { id: { not: excludeUserId } })
      }
    });
    return !!user;
  }

  // ✅ NOUVEAU : Vérifier si un email existe (sauf pour l'utilisateur actuel)
  async checkEmailExists(email: string, excludeUserId?: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        ...(excludeUserId && { id: { not: excludeUserId } })
      }
    });
    return !!user;
  }

  // ✅ NOUVEAU : Mettre à jour les informations d'un utilisateur
  async updateUser(id: number, data: { name?: string; email?: string }) {
    const updateData: any = {};
    
    if (data.name) {
      updateData.name = data.name.trim();
    }
    
    if (data.email) {
      updateData.email = data.email.trim().toLowerCase();
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        subscription: true,
      }
    });
  }

  // ✅ NOUVEAU : Vérifier le mot de passe actuel
  async verifyPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) return false;

    return bcrypt.compare(password, user.password);
  }

  // ✅ NOUVEAU : Mettre à jour le mot de passe
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  // ✅ NOUVEAU : Récupérer les paramètres utilisateur
  async getUserSettings(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true }
    });

    // Retourner les paramètres par défaut si non définis
    return user?.settings || {
      darkMode: false,
      language: 'fr',
      currency: 'EUR'
    };
  }

  // ✅ NOUVEAU : Mettre à jour les paramètres utilisateur
  async updateUserSettings(userId: number, settings: any) {
    // Récupérer les paramètres existants
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true }
    });

    // Fusionner avec les nouveaux paramètres
    const updatedSettings = {
      ...(currentUser?.settings as object || {}),
      ...settings
    };

    return this.prisma.user.update({
      where: { id: userId },
      data: { settings: updatedSettings },
      select: {
        id: true,
        settings: true
      }
    });
  }
}
