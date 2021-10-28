import config from "../config";
import ProofOfWork from "./wasp_client/proof_of_work";
import {
  BasicClient,
  Colors,
  IKeyPair,
  Seed,
  WalletService,
} from "./wasp_client";
import type { FairRouletteService } from "./fairroulette_client";

export default class Player {
  private readonly walletService: WalletService;
  private readonly client: BasicClient;
  private readonly fairRouletteService: FairRouletteService;

  private seed: Buffer;
  private addressIndex: number = 0;
  private address: string;
  private keyPair: IKeyPair;
  private funds: BigInt;

  constructor(
    basicClient: BasicClient,
    walletService: WalletService,
    fairRouletteService: FairRouletteService
  ) {
    this.seed = Seed.generate();
    this.walletService = walletService;
    this.client = basicClient;
    this.fairRouletteService = fairRouletteService;
  }

  public async initialize() {
    this.newAddress();
    await this.sendFaucetRequest();
  }

  private newAddress() {
    this.address = Seed.generateAddress(this.seed, this.addressIndex);
    this.keyPair = Seed.generateKeyPair(this.seed, this.addressIndex);

    this.addressIndex++;
  }

  async sendFaucetRequest(): Promise<void> {
    const faucetRequestResult = await this.walletService.getFaucetRequest(
      this.address
    );

    faucetRequestResult.faucetRequest.nonce = ProofOfWork.calculateProofOfWork(
      12,
      faucetRequestResult.poWBuffer
    );

    try {
      await this.client.sendFaucetRequest(faucetRequestResult.faucetRequest);
      await this.sleep(1000);
      await this.pollFunds();
    } catch (ex) {
      console.log(ex);
    }
  }

  async pollFunds() {
    this.funds = await this.walletService.getFunds(
      this.address,
      Colors.IOTA_COLOR_STRING
    );
  }

  async placeBet() {
    await this.pollFunds();

    if (this.funds < 200n) {
      this.newAddress();
      await this.sendFaucetRequest();
    }

    const amount = BigInt(Math.round(Math.random() * Number(this.funds)));
    const betNumber = 1 + Math.round(Math.random() * 7);

    console.log(
      `[BET] Address: [${this.address}], Balance: ${this.funds}i, Bet: ${amount}i, On: ${betNumber}`
    );
    if (this.funds <= 0n || amount <= 0n) {
      return;
    }

    await this.fairRouletteService.placeBetOnLedger(
      this.keyPair,
      this.address,
      betNumber,
      BigInt(amount)
    );
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
