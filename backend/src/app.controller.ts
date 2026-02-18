import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('shorten')
  async shorten(@Body('url') url: string) {
    return this.appService.shortenUrl(url);
  }

  @Get('urls')
  async findAll() {
    return this.appService.getAllUrls();
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const url = await this.appService.getOriginalUrl(code);
    return res.redirect(url.originalUrl); 
  }
}