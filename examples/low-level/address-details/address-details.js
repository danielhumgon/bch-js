/*
  Check the balance of the root address of an HD node wallet generated
  with the create-wallet example.
*/

// Instantiate BITBOX.
//const bitboxLib = "../../../lib/BITBOX"
//const BITBOXSDK = require(bitboxLib)
//const BITBOX = new BITBOXSDK({ restURL: "https://trest.bitcoin.com/v2/" })
const BCHJS = require("@chris.troutner/bch-js")
const bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:12400/v3/` })

//const ADDR = `bchtest:qr45kxqda7yw8atztvkc4ckqnrlhmp0kvsep4p345q`
const ADDR = "1BFHGm4HzqgXXyNX8n7DsQno5DAC4iLMRA"
async function addressDetails() {
  try {
    // first get BCH balance
    const balance = await bchjs.Insight.Address.details(ADDR)

    console.log(`BCH Balance information:`)
    console.log(balance)
  } catch (err) {
    console.error(`Error in getBalance: `, err)
    throw err
  }
}
addressDetails()
