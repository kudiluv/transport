import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './route.entity';
import { RouteParserService } from './route-parser.service';
import { PikasModule } from 'src/pikas/pikas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Route]), PikasModule],
  providers: [RoutesService, RouteParserService],
  controllers: [RoutesController],
  exports: [RoutesService, RouteParserService],
})
export class RoutesModule {}
