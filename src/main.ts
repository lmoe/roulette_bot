import config from '../config';
import ProofOfWork from './wasp_client/proof_of_work';
import { BasicClient, IKeyPair, Seed, WalletService } from './wasp_client';
import { FairRouletteService } from './fairroulette_client';
import Player from './player';

const client = new BasicClient(config.ClientConfiguration);
const fairRouletteService = new FairRouletteService(
  client,
  config.ClientConfiguration.ChainId
);
const walletService = new WalletService(client);

const players = [];

async function placeBetsInSeries() {
  const playerIndex = Math.floor(Math.random() * (players.length - 1));
  const player = players[playerIndex] as Player;

  console.log('[Series] Placing random bet with player ' + player.id);

  await player.placeBet();

  const min = config.BotConfiguration.MinWaitSeconds * 1000;
  const max = config.BotConfiguration.MaxWaitSeconds * 1000;

  const waitTime = Math.floor(Math.random() * (max - min) + min);
  console.log(`\nWaiting ${waitTime / 1000}s for the next bet\n`);
  setTimeout(placeBetsInSeries, waitTime);
}

async function placeBetsInParallel(player: Player) {
  console.log('[Parallel] Placing random bet with player ' + player.id);

  try {
    await player.placeBet();
  } catch {
    console.log("Place bet failed, retrying in the next round again.");
  }

  const min = config.BotConfiguration.MinWaitSeconds * 1000;
  const max = config.BotConfiguration.MaxWaitSeconds * 1000;

  const waitTime = Math.floor(Math.random() * (max - min) + min);
  console.log(`\nWaiting ${waitTime / 1000}s for the next bet\n`);
  setTimeout(() => placeBetsInParallel(player), waitTime);
}

async function main() {
  for (let i = 0; i < config.BotConfiguration.WorkerAmount; i++) {
    const player = new Player(i, config.ClientConfiguration.ProofOfWorkDifficulty, client, walletService, fairRouletteService);
    players.push(player);
  }

  await Promise.all(players.map((x) => x.initialize()));

  console.log(`Generated ${players.length} actors`);

  if (config.BotConfiguration.RunMode == 'series') {
    placeBetsInSeries();
  } else if (config.BotConfiguration.RunMode == 'parallel') {
    await Promise.all(players.map(async (x) => await placeBetsInParallel(x)));
  }
}

main();
