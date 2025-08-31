import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

import { ExchangeRates } from '../interfaces/exchange-rates.interface';
import { ExchangeRates as ExchangeRatesSchema } from '../exchange-rates.schema';

@Injectable()
export class ExchangeRatesService {
  private id: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(ExchangeRatesSchema.name) private readonly exchangeRatesModel: Model<ExchangeRatesSchema>,
    private schedulerRegistry: SchedulerRegistry
  ) {
    this.id = this.configService.get('appConfig.exchangeRatesApiKey');
  }

  private async handleExchangeRates(): Promise<ExchangeRates | null> {
    try {
      if (!this.id) {
        const job = this.schedulerRegistry.getCronJob('exchange rates');
        if (job) job.stop();

        throw new ConflictException(`Exchange rates ID not found`);
      }

      const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${this.id}`);
      const data = (await response.json()) as ExchangeRates;

      return data;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  private async createExchangeRates(data: ExchangeRates | null): Promise<ExchangeRatesSchema | null> {
    try {
      if (!data) {
        throw new BadRequestException('Exchange rates data not found');
      }
      const created = await this.exchangeRatesModel.create({ ...data });
      return created;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  private async findExchangeRates(): Promise<ExchangeRatesSchema | null> {
    const data = await this.exchangeRatesModel.find();
    return data.length > 0 ? data[0] : null;
  }

  @Cron('0 * * * 1-5', {
    name: 'exchange rates',
    utcOffset: 2,
  })
  private async updateExchangeRates() {
    const data = await this.findExchangeRates();
    const rates = await this.handleExchangeRates();

    if (data) {
      return await this.exchangeRatesModel.updateOne({ id: data.id }, { ...rates });
    } else {
      return this.createExchangeRates(rates);
    }
  }

  public async getExchangeRates(): Promise<ExchangeRatesSchema | null> {
    try {
      const data = await this.findExchangeRates();
      if (data) return data;

      const rates = await this.handleExchangeRates();
      return this.createExchangeRates(rates);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
