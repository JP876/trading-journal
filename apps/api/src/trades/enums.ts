export enum ResultOptions {
  WIN = 'WIN',
  LOSS = 'LOSS',
  BE = 'BE',
}

export enum DirectionOptions {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum OrderType {
  MARKET = 'market_order',
  BUY_LIMIT = 'buy_limit',
  BUY_STOP = 'buy_stop',
  SELL_LIMIT = 'sell_limit',
  SELL_STOP = 'sell_stop',
}

export enum ClosedBy {
  TP_SL = 'TP/SL',
  USER = 'user',
}
