import type { BotConfiguration } from 'bot_configuration';
import type { BasicClientConfiguration } from './src/wasp_client/basic_client';

const clientConfig: BasicClientConfiguration = {
  Seed: undefined,
  WaspWebSocketUrl: 'wss://api.wasp.sc.iota.org/chain/%chainId/ws',
  WaspAPIUrl: 'https://api.wasp.sc.iota.org',
  GoShimmerAPIUrl: 'https://api.goshimmer.sc.iota.org',
  ChainId: 'fuqnFDEUcCYCca5khvx5L16u18DBpvfWABJ4iAAYndGS',
};

const botConfiguration: BotConfiguration = {
  MaxWaitSeconds: 3,
  MinWaitSeconds: 1,
  RunMode: 'parallel',
  WorkerAmount: 10,
};

export default {
  ClientConfiguration: clientConfig,
  BotConfiguration: botConfiguration,
};
