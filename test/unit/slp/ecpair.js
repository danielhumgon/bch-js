const fixtures = require("../fixtures/slp/ecpair.json")
const assert = require("assert")

const SLP = require("../../../src/slp/slp")
const slp = new SLP()

// console.log(SLP)

// Used for debugging and iterrogating JS objects.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

console.log(`SLP.ECPair: ${util.inspect(SLP.ECPair)}`)

describe("#ECPair", () => {
  describe("#toSLPAddress", () => {
    it(`should return slp address for ecpair`, async () => {
      fixtures.wif.forEach((wif, index) => {
        const ecpair = slp.ECPair.fromWIF(wif)
        const slpAddr = slp.ECPair.toSLPAddress(ecpair)
        assert.equal(slpAddr, fixtures.address[index])
      })
    })
  })
})
