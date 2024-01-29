import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IndContentService } from './ind-content.service';

@Module({
  imports: [HttpModule],
  providers: [IndContentService],
  exports: [IndContentService],
})
export class IndContentModule {}
