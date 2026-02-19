import { Controller, Get, Post, Delete, Body, Param, Res, ParseIntPipe } from '@nestjs/common';
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

  @Delete('urls/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteUrl(id);
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const url = await this.appService.getOriginalUrl(code);
    return res.redirect(url.originalUrl); 
  }
}