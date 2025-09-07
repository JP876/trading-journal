import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { addHours, isAfter } from 'date-fns';

import { ExchangeRates } from '../interfaces/exchange-rates.interface';
import { ExchangeRates as ExchangeRatesSchema } from '../exchange-rates.schema';

interface CreateExchangeRate extends ExchangeRates {
  latest?: boolean;
}

@Injectable()
export class ExchangeRatesService {
  private id: string | undefined;
  private readonly logger = new Logger(ExchangeRatesService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(ExchangeRatesSchema.name) private readonly exchangeRatesModel: Model<ExchangeRatesSchema>,
    private schedulerRegistry: SchedulerRegistry
  ) {
    this.id = this.configService.get('appConfig.exchangeRatesApiKey');
  }

  private async getLatestExchangeRates(): Promise<ExchangeRates | null> {
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

  private async createExchangeRates(data: CreateExchangeRate | null): Promise<ExchangeRatesSchema | null> {
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

  public async findLatestExchangeRates(): Promise<ExchangeRatesSchema | null> {
    return await this.exchangeRatesModel.findOne({ latest: true });
  }

  @Cron('0 */4 * * 1-5', {
    name: 'exchange rates',
    utcOffset: 2,
  })
  private async updateExchangeRates(): Promise<ExchangeRatesSchema | null> {
    const data = await this.findLatestExchangeRates();
    const ratesData = await this.getLatestExchangeRates();

    this.logger.log('Updating exchange rates...');

    if (!ratesData) {
      throw new BadRequestException('Failed to fetch exchange rates data');
    }

    if (data) {
      return await this.exchangeRatesModel.findByIdAndUpdate(
        data.id,
        { ...ratesData, latest: true },
        { new: true, runValidators: true }
      );
    } else {
      return this.createExchangeRates({ ...ratesData, latest: true });
    }
  }

  public async getExchangeRates(): Promise<ExchangeRatesSchema | null> {
    const data = await this.findLatestExchangeRates();

    if (data) {
      if (isAfter(new Date(), addHours(new Date(data.updatedAt), 2))) {
        const ratesData = await this.getLatestExchangeRates();

        if (!ratesData) {
          throw new BadRequestException('Failed to fetch exchange rates data');
        }

        return await this.exchangeRatesModel.findByIdAndUpdate(
          data.id,
          { ...ratesData, latest: true },
          { new: true, runValidators: true }
        );
      } else {
        return data;
      }
    }

    const ratesData = await this.getLatestExchangeRates();

    if (!ratesData) {
      throw new BadRequestException('Failed to fetch exchange rates data');
    }

    return this.createExchangeRates({ ...ratesData, latest: true });
  }
}
