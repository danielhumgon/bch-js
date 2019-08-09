/*
  Check the balance of the root address of an HD node wallet generated
  with the create-wallet example.
*/

const BCHJS = require("../../../src/bch-js")
const bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:12400/v3/` })

const ADDR = "1KmP3LJXNhApDWtNKsdRc6gQM1c5TKrZMu"

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
