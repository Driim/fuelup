import { Module } from '@nestjs/common';
import { StationController } from './station.controller';
import { StationService } from './station.service';

@Module({
  imports: [],
  controllers: [StationController],
  providers: [StationService],
})
export class StationModule {}
