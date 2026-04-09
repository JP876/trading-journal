import { Controller, Get } from '@nestjs/common';

import { PairsService } from './providers/pairs.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get()
  @Auth('NONE')
  public async getAllPairs() {
    return await this.pairsService.getAll();
  }
}
