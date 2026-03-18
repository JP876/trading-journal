import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PairsController } from './pairs.controller';
import { PairsService } from './providers/pairs.service';
import { Pair } from './pair.entitiy';

@Module({
  controllers: [PairsController],
  providers: [PairsService],
  imports: [TypeOrmModule.forFeature([Pair])],
  exports: [PairsService],
})
export class PairsModule {}
