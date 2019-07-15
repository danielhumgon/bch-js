// imports
// require deps
//const BCHJS = require("../bch-js")
const Address = require("./address")
const ECPair = require("./ecpair")
const HDNode = require("./hdnode")
const TokenType1 = require("./tokentype1")
const Utils = require("./utils")

const slpjs = require("slpjs")

// SLP is a superset of BITBOX
class SLP {
  constructor(restURL) {
    this.restURL = restURL

    this.Address = new Address(restURL)
    this.ECPair = ECPair
    this.HDNode = new HDNode(restURL)
    this.TokenType1 = new TokenType1(restURL)
    this.Utils = new Utils(restURL)
    this.slpjs = slpjs
  }
}

module.exports = SLP
