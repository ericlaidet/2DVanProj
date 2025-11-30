import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(email: string, password: string, name: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    // Vérifier si l'email existe déjà (insensible à la casse)
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Vérifier si le nom existe déjà (insensible à la casse)
    const existingName = await this.prisma.user.findFirst({
      where: { name: { equals: normalizedName, mode: 'insensitive' } },
    });
    if (existingName) {
      throw new ConflictException('Ce nom est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashed = await bcrypt.hash(password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        name: normalizedName,
        subscription: 'FREE',
      },
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...safeUser } = createdUser;
    return safeUser;
  }

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return null;

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return null;

    return user;
  }

  async generateToken(userId: number): Promise<{ token: string; expiresAt: Date }> {
    const payload = { sub: userId };
    const expiresInHours = 8;

    const token = this.jwtService.sign(payload, { expiresIn: `${expiresInHours}h` });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    // Supprimer les anciennes sessions
    await this.prisma.session.deleteMany({ where: { userId } });

    // Créer une nouvelle session
    await this.prisma.session.create({ data: { userId, token, expiresAt } });

    return { token, expiresAt };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Identifiants incorrects');

    const { token, expiresAt } = await this.generateToken(user.id);
    const { password: _, ...safeUser } = user;
    return { access_token: token, expiresAt, user: safeUser };
  }

  async revokeToken(token: string) {
    await this.prisma.session.deleteMany({ where: { token } });
    return { success: true };
  }
}
