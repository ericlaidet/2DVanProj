import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { VanType } from '@prisma/client';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------------------------------
  // 🔹 Fonction utilitaire pour calculer la date d'expiration
  // -----------------------------------------------------
  private computeExpiresAt(subscription: string, fromDate: Date = new Date()): Date {
    let expiresAt: Date;

    switch (subscription) {
      case 'FREE':
        expiresAt = new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 jours
        break;
      case 'PRO1':
        expiresAt = new Date(fromDate);
        expiresAt.setMonth(expiresAt.getMonth() + 1); // +1 mois
        break;
      case 'PRO2':
        expiresAt = new Date(fromDate);
        expiresAt.setMonth(expiresAt.getMonth() + 6); // +6 mois
        break;
      case 'PRO3':
        expiresAt = new Date(fromDate);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // +1 an
        break;
      default:
        expiresAt = new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000); // fallback FREE
    }

    return expiresAt;
  }

  // -----------------------------------------------------
  // 🔹 Création d'un plan utilisateur
  // -----------------------------------------------------
  async createPlanForUser(userId: number, dto: CreatePlanDto) {
    const { name, jsonData, vanTypes } = dto;

    // Vérifier l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscription: true },
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const createdAt = new Date();
    const expiresAt = this.computeExpiresAt(user.subscription, createdAt);

    return this.prisma.plan.create({
      data: {
        name,
        jsonData,
        createdAt,
        expiresAt,
        user: { connect: { id: userId } },
        planVans: {
          create: vanTypes.map((v: VanType) => ({
            van: { connect: { vanType: v } },
          })),
        },
      },
      include: { planVans: { include: { van: true } } },
    });
  }

  // -----------------------------------------------------
  // 🔹 Mise à jour d’un plan utilisateur
  // -----------------------------------------------------
  async updateForUser(userId: number, planId: number, dto: UpdatePlanDto) {
    const { name, jsonData, vanTypes } = dto;
    const vans = vanTypes ?? [];

    // Vérifier l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscription: true },
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const expiresAt = this.computeExpiresAt(user.subscription);

    return this.prisma.plan.update({
      where: { id: planId, userId },
      data: {
        ...(name && { name }),
        ...(jsonData && { jsonData }),
        expiresAt,
        // ⚙️ On met à jour la relation van
        planVans: vans.length
          ? {
              deleteMany: {}, // supprime toutes les anciennes associations
              create: vans.map((v: VanType) => ({
                van: { connect: { vanType: v } },
              })),
            }
          : undefined,
      },
      include: { planVans: { include: { van: true } } },
    });
  }

  // -----------------------------------------------------
  // 🔹 Récupérer tous les plans valides d'un utilisateur
  // -----------------------------------------------------
  async findAllForUser(userId: number) {
    return this.prisma.plan.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() }, // ✅ seulement ceux qui ne sont pas expirés
      },
      include: { planVans: { include: { van: true } } },
    });
  }

  // -----------------------------------------------------
  // 🔹 Récupérer un plan précis
  // -----------------------------------------------------
  async findOneForUser(userId: number, id: number) {
    const plan = await this.prisma.plan.findFirst({
      where: { id, userId },
      include: { planVans: { include: { van: true } } },
    });

    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);

    return plan;
  }

  // -----------------------------------------------------
  // 🔹 Supprimer un plan (et ses associations)
  // -----------------------------------------------------
  async removeForUser(userId: number, id: number) {
    // D'abord, vérifier que le plan existe
    const plan = await this.prisma.plan.findFirst({
      where: { id, userId },
    });
    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);

    // 🧹 Supprimer les PlanVan associés (évite la contrainte étrangère)
    await this.prisma.planVan.deleteMany({
      where: { planId: id },
    });

    // Puis supprimer le plan
    return this.prisma.plan.delete({
      where: { id },
    });
  }
}
