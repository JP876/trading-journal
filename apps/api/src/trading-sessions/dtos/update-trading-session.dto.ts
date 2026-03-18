import { PartialType } from '@nestjs/mapped-types';

import { CreateTradingSession } from './create-trading-session.dto';

export class UpdateTradingSession extends PartialType(CreateTradingSession) {}
