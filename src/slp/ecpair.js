const BCHJS = require("../bch-js")
const bchjs = new BCHJS()

const BCHJSECPair = require("../ecpair")

const utils = require("slpjs").Utils

class ECPair extends BCHJSECPair {
  toSLPAddress(ecpair) {
    const slpAddress = utils.toSlpAddress(bchjs.ECPair.toCashAddress(ecpair))
    return slpAddress
  }
}

export default ECPair
