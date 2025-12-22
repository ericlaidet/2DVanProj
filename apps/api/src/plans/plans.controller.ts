import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreatePlanDto) {
    return this.plansService.createPlanForUser(req.user.id, dto);
  }

@Get()
async findAll(@Request() req: any) {
  try {
    console.log('🔍 Getting plans for user:', req.user.id);
    return await this.plansService.findAllForUser(req.user.id);
  } catch (error) {
    console.error('❌ PLANS ERROR:', error);
    throw error;
  }
}

  @Get(':id')
  async findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.plansService.findOneForUser(req.user.id, id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlanDto,
    @Request() req: any,
  ) {
    return this.plansService.updateForUser(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.plansService.removeForUser(req.user.id, id);
  }
}
