/*
  Integration tests for the bchjs covering SLP tokens.
*/

const chai = require("chai")
const assert = chai.assert

const BCHJS = require("../../src/bch-js")
const bchjs = new BCHJS()

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

describe(`#SLP`, () => {
  describe("#util", () => {
    it(`should get information on the Spice token`, async () => {
      const tokenId = `4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf`

      const result = await bchjs.SLP.Utils.list(tokenId)
      //console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.hasAnyKeys(result, [
        "decimals",
        "timestamp",
        "timestamp_unix",
        "versionType",
        "documentUri",
        "symbol",
        "name",
        "containsBaton",
        "id",
        "documentHash",
        "initialTokenQty",
        "blockCreated",
        "blockLastActiveSend",
        "blockLastActiveMint",
        "txnsSinceGenesis",
        "validAddress",
        "totalMinted",
        "totalBurned",
        "circulatingSupply",
        "mintingBatonStatus"
      ])
    })
  })
})
