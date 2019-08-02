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
  /**
   * @api SLP.ECPair.toSLPAddress() Get slp address of ECPair.
   * @apiName toSLPAddress
   * @apiGroup SLP
   * @apiDescription Get slp address of ECPair.
   *
   * @apiExample Example usage:
   *  // create ecpair from wif
   *  let ecpair = bchjs.SLP.ECPair.fromWIF('cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS')
   *  // to slp address
   *  bchjs.SLP.ECPair.toSLPAddress(ecpair);
   *  // slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03
   */
  static toSLPAddress(ecpair) {
    const slpAddress = utils.toSlpAddress(this.toCashAddress(ecpair))
    return slpAddress
  }
}

module.exports = ECPair
