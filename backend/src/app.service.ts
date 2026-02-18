import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { randomUUID } from 'node:crypto'; 

@Injectable()
export class AppService {
  private readonly characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor(private prisma: PrismaService) {}

  private encodeId(id: number): string {
    let base = this.characters.length;
    let encoded = '';
    
    if (id === 0) return this.characters[0];

    while (id > 0) {
      let val = id % base;
      id = Math.floor(id / base);
      encoded = this.characters[val] + encoded;
    }
    return encoded;
  }

  async shortenUrl(originalUrl: string) {
    if (!originalUrl) throw new BadRequestException('URL manquante');
    const tempCode = randomUUID(); 
    
    const newUrl = await this.prisma.url.create({
      data: {
        originalUrl,
        shortCode: tempCode, 
      },
    });

    const robustCode = this.encodeId(newUrl.id);

    return this.prisma.url.update({
      where: { id: newUrl.id },
      data: { shortCode: robustCode },
    });
  }

  async getOriginalUrl(shortCode: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });
    if (!url) throw new NotFoundException('URL introuvable');
    return url;
  }

  async getAllUrls() {
    return this.prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}