const BCHJSHDNode = require("../hdnode")

const BCHJS = require("../bch-js")
const bchjs = new BCHJS()

const utils = require("slpjs").Utils

class HDNode extends BCHJSHDNode {
  constructor(restURL) {
    super(restURL)
    this.restURL = restURL
  }

  toLegacyAddress(hdNode) {
    return bitbox.HDNode.toLegacyAddress(hdNode)
  }

  toCashAddress(hdNode, regtest = false) {
    return bitbox.HDNode.toCashAddress(hdNode, regtest)
  }

  toSLPAddress(hdNode) {
    const cashAddr = bitbox.HDNode.toCashAddress(hdNode)
    return utils.toSlpAddress(cashAddr)
  }
}

module.exports = HDNode
