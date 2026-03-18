import { Controller, Get } from '@nestjs/common';
import { PairsService } from './providers/pairs.service';

@Controller('pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get()
  public async getAllPairs() {
    return await this.pairsService.getAll();
  }
}
