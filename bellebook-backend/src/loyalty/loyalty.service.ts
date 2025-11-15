import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPoints(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
        pointsHistory: true,
      },
    });

    return {
      points: user?.points || 0,
      history: user?.pointsHistory ? JSON.parse(user.pointsHistory) : [],
    };
  }

  async getRewards() {
    return this.prisma.loyaltyReward.findMany({
      where: { isActive: true },
      orderBy: { points: 'asc' },
    });
  }

  async addPoints(
    userId: string,
    points: number,
    action: string,
    description: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const history = user?.pointsHistory ? JSON.parse(user.pointsHistory) : [];

    history.push({
      action,
      points,
      date: new Date().toISOString(),
      description,
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        points: (user?.points || 0) + points,
        pointsHistory: JSON.stringify(history),
      },
    });
  }

  async redeemReward(userId: string, rewardId: string) {
    const [reward, user] = await Promise.all([
      this.prisma.loyaltyReward.findUnique({
        where: { id: rewardId },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
      }),
    ]);

    if (!reward) {
      throw new Error('Recompensa não encontrada');
    }

    if (!reward.isActive) {
      throw new Error('Recompensa não está ativa');
    }

    if ((user?.points || 0) < reward.points) {
      throw new Error('Pontos insuficientes');
    }

    await this.addPoints(
      userId,
      -reward.points,
      'REDEEM_REWARD',
      `Resgatou: ${reward.name}`,
    );

    return {
      success: true,
      reward,
      remainingPoints: (user?.points || 0) - reward.points,
    };
  }
}
