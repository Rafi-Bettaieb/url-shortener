import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { randomUUID } from 'node:crypto'; 

@Injectable()
export class AppService {
  private readonly characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor(private prisma: PrismaService) {}

  private async isUrlReachable(targetUrl: string): Promise<boolean> {
    try {
      new URL(targetUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(targetUrl, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UrlShortenerBot/1.0)', 
        },
      });

      clearTimeout(timeoutId);
      return response.ok || (response.status >= 300 && response.status < 400);
    } catch (error) {
      return false;
    }
  }

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

    const isValid = await this.isUrlReachable(originalUrl);
    if (!isValid) {
      throw new BadRequestException("L'URL fournie est inaccessible ou n'existe pas.");
    }

    const existingUrl = await this.prisma.url.findFirst({
      where: { originalUrl },
    });

    if (existingUrl) {
      return { ...existingUrl, isNew: false };
    }

    const tempCode = randomUUID(); 
    
    const newUrl = await this.prisma.url.create({
      data: {
        originalUrl,
        shortCode: tempCode, 
      },
    });

    const robustCode = this.encodeId(newUrl.id);

    const updatedUrl = await this.prisma.url.update({
      where: { id: newUrl.id },
      data: { shortCode: robustCode },
    });

    return { ...updatedUrl, isNew: true };
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

  async deleteUrl(id: number) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    });
    if (!url) throw new NotFoundException('URL introuvable');
    
    return this.prisma.url.delete({
      where: { id },
    });
  }
}