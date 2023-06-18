import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnListDto, UpdateColumnDto } from './dto/column.dto';
import { Column } from '@prisma/client';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) { }

  @Post('update')
  async update(@Body() updateColumnDto: UpdateColumnDto): Promise<Column> {
    return this.columnService.update(updateColumnDto);
  }

  @Get('list')
  async list(@Query() columnListDto: ColumnListDto) {
    return this.columnService.list(columnListDto);
  }
}
