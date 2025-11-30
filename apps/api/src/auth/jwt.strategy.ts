import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // ✅ On précise explicitement le bon type générique ici :
    super(<StrategyOptionsWithRequest>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authHeader.split(' ')[1];

    // Vérification de la session active
    const session = await this.prisma.session.findFirst({ where: { token } });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expiré ou révoqué');
    }

    // Vérification de l'utilisateur associé
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return {
      id: user.id,
      email: user.email,
      subscription: user.subscription,
    };
  }
}
