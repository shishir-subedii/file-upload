import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { ProjectModule } from 'src/project/project.module';
import { Project } from 'src/project/entities/project.entity';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Entry, Project]),
    ProjectModule
  ],
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}
