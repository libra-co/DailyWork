import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { PrismaService } from 'src/prisima.service';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService, PrismaService],
  exports: [ColumnService]
})
export class ColumnModule { }
