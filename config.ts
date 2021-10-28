import type { BasicClientConfiguration } from "./src/wasp_client/basic_client";

const config: BasicClientConfiguration = {
  Seed: undefined,
  WaspWebSocketUrl: "wss://api.wasp.sc.iota.org/chain/%chainId/ws",
  WaspAPIUrl: "https://api.wasp.sc.iota.org",
  GoShimmerAPIUrl: "https://api.goshimmer.sc.iota.org",
  ChainId: "fuqnFDEUcCYCca5khvx5L16u18DBpvfWABJ4iAAYndGS",
};

export default config;
