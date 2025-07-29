
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtmoduleModule } from './common/jwtmodule/jwtmodule.module';
import { ProjectModule } from './project/project.module';
import { EntryModule } from './entry/entry.module';

@Module({
  imports: [
    DatabaseModule, UsersModule, AuthModule, AppConfigModule, JwtmoduleModule, ProjectModule, EntryModule
  ],
  providers: [],
})
export class AppModule { }
