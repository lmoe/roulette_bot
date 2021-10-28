import config from "../config";
import ProofOfWork from "./wasp_client/proof_of_work";
import { BasicClient, IKeyPair, Seed, WalletService } from "./wasp_client";
import { FairRouletteService } from "./fairroulette_client";
import Player from "./player";

const client = new BasicClient(config);
const fairRouletteService = new FairRouletteService(client, config.ChainId);
const walletService = new WalletService(client);

const players = [];

async function placeBet() {
  const playerIndex = Math.floor(Math.random() * (players.length - 1));
  const player = players[playerIndex] as Player;

  console.log("Placing random bet with player " + playerIndex);

  await player.placeBet();

  const min = 15 * 1000;
  const max = 30 * 1000;

  const waitTime = Math.floor(Math.random() * (max - min) + min);
  console.log(`\nWaiting ${waitTime / 1000}s for the next bet\n`);
  setTimeout(placeBet, waitTime);
}

async function main() {
  for (let i = 0; i < 10; i++) {
    const player = new Player(client, walletService, fairRouletteService);
    players.push(player);
  }

  await Promise.all(players.map((x) => x.initialize()));

  console.log(`Generated ${players.length} actors`);

  placeBet();
}

main();
