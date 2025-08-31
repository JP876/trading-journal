import { Controller, Get } from '@nestjs/common';

import { ExchangeRatesService } from './providers/exchange-rates.service';

@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get()
  async getExchangeRates() {
    return this.exchangeRatesService.getExchangeRates();
  }
}
