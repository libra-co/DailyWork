import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { NotionService } from './notion.service';
import { AddNotionDto, DeleteNotionDto, ListNotionDto, NotionDetailDto, OrderNotionDto, UpdateNotionDto } from './dto/notion.dto';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) { }

  @Post('add')
  async add(@Req() req, @Body() addNotionDto: AddNotionDto) {
    return this.notionService.add(req.user, addNotionDto)
  }

  @Get('list')
  async list(@Query() listNotionDto: ListNotionDto) {
    return this.notionService.list(listNotionDto)
  }

  @Post('update')
  async update(@Body() updateNotionDto: UpdateNotionDto) {
    return this.notionService.update(updateNotionDto)
  }

  @Get('detail')
  async detail(@Query() detailNotionDto: NotionDetailDto) {
    return this.notionService.detail(detailNotionDto)
  }

  @Post('delete')
  async delete(@Body() deleteNotionDto: DeleteNotionDto) {
    return this.notionService.delete(deleteNotionDto)
  }
  @Post('order')
  async order(@Body() orderNotionDto: OrderNotionDto) {
    return this.notionService.order(orderNotionDto)
  }
}
