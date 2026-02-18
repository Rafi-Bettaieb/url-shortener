import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    shortenUrl: jest.fn(),
    getAllUrls: jest.fn(),
    getOriginalUrl: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('shorten', () => {
    it('should call appService.shortenUrl and return the result', async () => {
      const url = 'https://google.com';
      const result = { id: 1, originalUrl: url, shortCode: 'abc', createdAt: new Date() };
      
      mockAppService.shortenUrl.mockResolvedValue(result);

      expect(await appController.shorten(url)).toBe(result);
      expect(appService.shortenUrl).toHaveBeenCalledWith(url);
    });
  });

  describe('findAll', () => {
    it('should return an array of urls', async () => {
      const result = [{ id: 1, originalUrl: 'https://test.com', shortCode: 'xyz', createdAt: new Date() }];
      
      mockAppService.getAllUrls.mockResolvedValue(result);

      expect(await appController.findAll()).toBe(result);
      expect(appService.getAllUrls).toHaveBeenCalled();
    });
  });

  describe('redirect', () => {
    it('should redirect to the original URL', async () => {
      const code = 'abc';
      const urlData = { originalUrl: 'https://redirect.com' };
            const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      mockAppService.getOriginalUrl.mockResolvedValue(urlData);

      await appController.redirect(code, res);

      expect(appService.getOriginalUrl).toHaveBeenCalledWith(code);
      expect(res.redirect).toHaveBeenCalledWith(urlData.originalUrl);
    });
  });
});