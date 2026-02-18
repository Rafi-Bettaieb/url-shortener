import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../src/app.service';     // Chemin mis à jour
import { PrismaService } from '../src/prisma.service'; // Chemin mis à jour
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AppService (Integration)', () => {
  let service: AppService;
  let prisma: PrismaService;

  const mockPrismaService = {
    url: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('shortenUrl', () => {
    it('doit générer un code unique basé sur l\'ID (ex: ID 11 -> code "b")', async () => {
      const url = 'https://test.com';
      mockPrismaService.url.create.mockResolvedValue({ id: 11, originalUrl: url });
      mockPrismaService.url.update.mockResolvedValue({ id: 11, originalUrl: url, shortCode: 'b' });

      const result = await service.shortenUrl(url);

      expect(prisma.url.create).toHaveBeenCalled();
      expect(prisma.url.update).toHaveBeenCalledWith({
        where: { id: 11 },
        data: { shortCode: 'b' },
      });
      expect(result.shortCode).toBe('b');
    });

    it('doit lever une erreur si l\'URL est vide', async () => {
      await expect(service.shortenUrl('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOriginalUrl', () => {
    it('doit lever une 404 si le code n\'existe pas', async () => {
      mockPrismaService.url.findUnique.mockResolvedValue(null);
      await expect(service.getOriginalUrl('inconnu')).rejects.toThrow(NotFoundException);
    });
  });
});