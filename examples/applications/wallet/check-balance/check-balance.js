/*
  Check the balance of the root address of an HD node wallet generated
  with the create-wallet example.
*/

// Set NETWORK to either testnet or mainnet
const NETWORK = `mainnet`

const BCHJS = require("../../../../src/bch-js")

// Instantiate SLP based on the network.
let bchjs
if (NETWORK === `mainnet`)
  bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:12400/v3/` })
else bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:13400/v3/` })

// Open the wallet generated with create-wallet.
try {
  var walletInfo = require(`../create-wallet/wallet.json`)
} catch (err) {
  console.log(
    `Could not open wallet.json. Generate a wallet with create-wallet first.`
  )
  process.exit(0)
}

// Get the balance of the wallet.
async function getBalance() {
  try {
    // first get BCH balance
    const balance = await bchjs.Insight.Address.details(walletInfo.cashAddress)

    console.log(`BCH Balance information:`)
    console.log(balance)
  } catch (err) {
    console.error(`Error in getBalance: `, err)
    throw err
  }
}
getBalance()
