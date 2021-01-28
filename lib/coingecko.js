const CoinGecko = require("coingecko-api");
const fs = require("fs");

const CoinGeckoClient = new CoinGecko();
const COIN_GECKO_IDS = [
  "bitcoin",
  "ethereum",
  "tether",
  "polkadot",
  "ripple",
  "litecoin",
  "bitcoin-cash",
  "cardano",
  "chainlink",
  "stellar",
  "binancecoin",
  "usd-coin",
  "monero",
  "eos",
  "crypto-com-chain",
];
const COIN_MAPPING = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  polkadot: "DOT",
  ripple: "XRP",
  litecoin: "LTC",
  "bitcoin-cash": "BCH",
  cardano: "ADA",
  chainlink: "LINK",
  stellar: "XLM",
  binancecoin: "BNB",
  "usd-coin": "USDC",
  monero: "XMR",
  eos: "EOS",
  "crypto-com-chain": "EOS",
};
const coinPriceCache = fs.existsSync("../coin_gecko_cache.json")
  ? JSON.parse(fs.readFileSync("../coin_gecko_cache.json", "utf8"))
  : {};

async function updateCoingeckoCacheAndDisk() {
  let result;
  try {
    result = await CoinGeckoClient.simple.price({
      ids: COIN_GECKO_IDS,
      vs_currencies: "cad",
    });
    if (result.code !== 200) {
      console.error("failed to query coingecko api.", result);
      return setTimeout(updateCoingeckoCacheAndDisk, 10000);
    }
  } catch (e) {
    console.error("error querying coingecko api.", e);
    return setTimeout(updateCoingeckoCacheAndDisk, 10000);
  }

  Object.keys(result.data).forEach((coinID) => {
    coinPriceCache[COIN_MAPPING[coinID]] = result.data[coinID].cad;
  });

  fs.writeFile(
    "../coin_gecko_cache.json",
    JSON.stringify(coinPriceCache),
    (err) => {
      if (err) {
        console.error("error writing coingecko cache to disk.", err);
      }
      setTimeout(updateCoingeckoCacheAndDisk, 10000);
    }
  );
}

setTimeout(updateCoingeckoCacheAndDisk, 10000);

module.exports.getCoinPriceCacheLastUpdatedAt = () =>
  fs.statSync("../coin_gecko_cache.json").mtime.toISOString();
module.exports.coinPriceCache = coinPriceCache;