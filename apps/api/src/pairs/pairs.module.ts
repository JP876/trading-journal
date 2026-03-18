import { Module } from '@nestjs/common';
import { PairsController } from './pairs.controller';
import { PairsService } from './providers/pairs.service';

@Module({
  controllers: [PairsController],
  providers: [PairsService]
})
export class PairsModule {}
