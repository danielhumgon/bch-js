//const BCHJS = require("../bch-js")
//const bchjs = new BCHJS()

const BCHJSECPair = require("../ecpair")

const utils = require("slpjs").Utils

class ECPair extends BCHJSECPair {
  /*
  constructor(restURL) {
    super(restURL)
    this.restURL = restURL
  }
  */

  static toSLPAddress(ecpair) {
    const slpAddress = utils.toSlpAddress(this.toCashAddress(ecpair))
    return slpAddress
  }
}

module.exports = ECPair
