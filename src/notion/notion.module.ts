import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { NotionController } from './notion.controller';
import { PrismaService } from 'src/prisima.service';

@Module({
  controllers: [NotionController],
  providers: [NotionService,PrismaService]
})
export class NotionModule {}
