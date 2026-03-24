export enum ResultOptions {
  WIN = 'win',
  LOSS = 'loss',
  BE = 'be',
}

export enum DirectionOptions {
  LONG = 'long',
  SHORT = 'short',
}

export enum OrderType {
  MARKET = 'market_order',
  BUY_LIMIT = 'buy_limit',
  BUY_STOP = 'buy_stop',
  SELL_LIMIT = 'sell_limit',
  SELL_STOP = 'sell_stop',
}

export enum ClosedBy {
  TP_SL = 'tp/sl',
  USER = 'user',
}
