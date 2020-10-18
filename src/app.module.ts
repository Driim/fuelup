import { Module } from '@nestjs/common';
import { StationModule } from './domains/station';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StationModule],
})
export class AppModule {}
