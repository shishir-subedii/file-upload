import { Module } from '@nestjs/common';
import { PublicApiController } from './public-api.controller';
import { EntryModule } from 'src/entry/entry.module';

@Module({
  imports: [EntryModule],
  controllers: [PublicApiController]
})
export class PublicApiModule {}
