/*
  Check the balance of the root address of an HD node wallet generated
  with the create-wallet example.
*/

// Set NETWORK to either testnet or mainnet
const NETWORK = `mainnet`

const BCHJS = require("../../../src/bch-js")
//const bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:12400/v3/` });

// Instantiate SLP based on the network.
let bchjs
if (NETWORK === `mainnet`)
  bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:12400/v3/` })
else bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:13400/v3/` })

// Open the wallet generated with create-wallet.
try {
  var walletInfo = require(`../../applications/wallet/create-wallet/wallet.json`)
} catch (err) {
  console.log(
    `Could not open wallet.json. Generate a wallet with create-wallet first.`
  )
  process.exit(0)
}

const ADDR = walletInfo.cashAddress

async function getUtxos() {
  try {
    // first get BCH balance
    const utxos = await bchjs.Insight.Address.utxo(ADDR)

    console.log(`UTXO information for address ${ADDR}:`)
    console.log(`result: ${JSON.stringify(utxos, null, 2)}`)
  } catch (err) {
    console.error(`Error in getUtxos: `, err)
    throw err
  }
}
getUtxos()
