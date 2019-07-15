const BCHJS = require("../bch-js")
const bchjs = new BCHJS()

const BCHJSECPair = require("../ecpair")

const utils = require("slpjs").Utils

// Used for debugging and iterrogating JS objects.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }
console.log(`BCHJSECPair: ${util.inspect(BCHJSECPair)}`)

class ECPair extends BCHJSECPair {
  /*
  constructor(restURL) {
    super(restURL)
    this.restURL = restURL
  }
  */

  static toSLPAddress(ecpair) {
    const slpAddress = utils.toSlpAddress(bchjs.ECPair.toCashAddress(ecpair))
    return slpAddress
  }
}

module.exports = ECPair
