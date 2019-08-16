const BCHJSHDNode = require("../hdnode")

//const BCHJS = require("../bch-js")
//const bchjs = new BCHJS()

const utils = require("slpjs").Utils

class HDNode extends BCHJSHDNode {
  constructor(restURL) {
    super(restURL)
    this.restURL = restURL
  }

  /**
   * @api SLP.HDNode.toLegacyAddress() toLegacyAddress() - Get legacy address of HDNode.
   * @apiName toLegacyAddress
   * @apiGroup SLP
   * @apiDescription Get legacy address of HDNode.
   *
   * @apiExample Example usage:
   * // create mnemonic
   * let mnemonic = bchjs.Mnemonic.generate(128);
   * // create seed buffer from mnemonic
   * let seedBuffer = bchjs.Mnemonic.toSeed(mnemonic);
   * // create HDNode from seed buffer
   * let hdNode = bchjs.SLP.HDNode.fromSeed(seedBuffer);
   * // to legacy address
   * bchjs.SLP.HDNode.toLegacyAddress(hdNode);
   * // 14apxtw2LDQmXWsS5k4JEhG93Jzjswhvma
   *
   * // generate entropy
   * let entropy = bchjs.Crypto.randomBytes(32);
   * // create mnemonic from entropy
   * let mnemonic = bchjs.Mnemonic.fromEntropy(entropy);
   * // create seed buffer from mnemonic
   * let seedBuffer = bchjs.Mnemonic.toSeed(mnemonic);
   * // create HDNode from seed buffer
   * let hdNode = bchjs.SLP.HDNode.fromSeed(seedBuffer);
   * // to cash address
   * bchjs.SLP.HDNode.toLegacyAddress(hdNode);
   * // 14mVsq3H5Ep2Jb6AqoKsmY1BFHKCBGPDLi
   */
  toLegacyAddress(hdNode) {
    return bitbox.HDNode.toLegacyAddress(hdNode)
  }

  /**
   * @api SLP.HDNode.toCashAddress() toCashAddress() - Get cash address of HDNode.
   * @apiName toCashAddress
   * @apiGroup SLP
   * @apiDescription Get cash address of HDNode.
   *
   * @apiExample Example usage:
   * // create mnemonic
   * let mnemonic = bchjs.Mnemonic.generate(128);
   * // create seed buffer from mnemonic
   * let seedBuffer = bchjs.Mnemonic.toSeed(mnemonic);
   * // create HDNode from seed buffer
   * let hdNode = bchjs.SLP.HDNode.fromSeed(seedBuffer);
   * // to cash address
   * bchjs.SLP.HDNode.toCashAddress(hdNode);
   * // bitcoincash:qqrz6kqw6nvhwgwrt4g7fggepvewtkr7nukkeqf4rw
   *
   * // generate entropy
   * let entropy = bchjs.Crypto.randomBytes(32);
   * // create mnemonic from entropy
   * let mnemonic = bchjs.Mnemonic.fromEntropy(entropy);
   * // create seed buffer from mnemonic
   * let seedBuffer = bchjs.Mnemonic.toSeed(mnemonic);
   * // create HDNode from seed buffer
   * let hdNode = bchjs.SLP.HDNode.fromSeed(seedBuffer);
   * // to cash address
   * bchjs.SLP.HDNode.toCashAddress(hdNode);
   * // bitcoincash:qq549jxsjv66kw0smdju4es2axnk7hhe9cquhjg4gt
   */
  toCashAddress(hdNode, regtest = false) {
    return bitbox.HDNode.toCashAddress(hdNode, regtest)
  }

  /**
   * @api SLP.HDNode.toSLPAddress() toSLPAddress() - Get slp address of HDNode.
   * @apiName toSLPAddress
   * @apiGroup SLP
   * @apiDescription Get slp address of HDNode.
   *
   * @apiExample Example usage:
   * // create mnemonic
   * let mnemonic = bchjs.Mnemonic.generate(128);
   * // create seed buffer from mnemonic
   * let seedBuffer = bchjs.Mnemonic.toSeed(mnemonic);
   * // create HDNode from seed buffer
   * let hdNode = bchjs.SLP.HDNode.fromSeed(seedBuffer);
   * // to cash address
   * bchjs.SLP.HDNode.toSLPAddress(hdNode);
   * // simpleledger:qpst7ganm0ucmj3yl7jxvdqrm7tg3zhveg89xjh25d
   *
   * // generate entropy
   * let entropy = bchjs.Crypto.randomBytes(32);
   * // create mnemonic from entropy
   * let mnemonic = bchjs.Mnemonic.fromEntropy(entropy);
   * // create seed buffer from mnemonic
   * let seedBuffer = bchjs.Mnemonic.toSeed(mnemonic);
   * // create HDNode from seed buffer
   * let hdNode = bchjs.SLP.HDNode.fromSeed(seedBuffer);
   * // to cash address
   * bchjs.SLP.HDNode.toSLPAddress(hdNode);
   * // simpleledger:qqxh2z2z397m4c6u9s5x6wjtku742q8rpvm6al2nrf
   */
  toSLPAddress(hdNode) {
    const cashAddr = bitbox.HDNode.toCashAddress(hdNode)
    return utils.toSlpAddress(cashAddr)
  }
}

module.exports = HDNode
