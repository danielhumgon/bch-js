// local deps
const BitcoinCash = require("./bitcoincash")
const Crypto = require("./crypto")
const Util = require("./util")
const Blockchain = require("./blockchain")
const Control = require("./control")
const Generating = require("./generating")
const Mining = require("./mining")
const RawTransactions = require("./raw-transactions")
const Mnemonic = require("./mnemonic")
const Address = require("./address")
const HDNode = require("./hdnode")
const TransactionBuilder = require("./transaction-builder")
const ECPair = require("./ecpair")
const Script = require("./script")
const Price = require("./price")
const Socket = require("./socket")
const Wallet = require("./wallet")
const Schnorr = require("./schnorr")

const InsightAddress = require("./insight/address")
const InsightBlock = require("./insight/block")
const InsightTransaction = require("./insight/transaction")

const Blockbook = require("./blockbook")
const Bitcore = require("./bitcore")

class BCHJS {
  constructor(config) {
    // Try to retrieve the REST API URL from different sources.
    if (config && config.restURL && config.restURL !== "") {
      this.restURL = config.restURL
    } else if (process.env.RESTURL && process.env.RESTURL !== "") {
      this.restURL = process.env.RESTURL
    } else {
      //this.restURL = "http://localhost:3000/v3/"
      this.restURL = "http://192.168.0.36:12400/v3/"
    }

    // Populate the Insight API endpoints.
    this.Insight = {}
    this.Insight.Address = new InsightAddress(this.restURL)
    this.Insight.Block = new InsightBlock(this.restURL)
    this.Insight.Transaction = new InsightTransaction(this.restURL)

    // Populate Blockbook endpoints.
    this.Blockbook = new Blockbook(this.restURL)

    // Populate Bitcore endpoints
    this.Bitcore = new Bitcore(this.restURL)

    // Populate Full Node
    this.Control = new Control(this.restURL)
    this.Mining = new Mining(this.restURL)
    this.RawTransactions = new RawTransactions(this.restURL)

    // Populate utility functions
    this.Address = new Address(this.restURL)
    this.BitcoinCash = new BitcoinCash(this.Address)
    this.Blockchain = new Blockchain(this.restURL)
    this.Crypto = Crypto
    this.ECPair = ECPair
    this.ECPair.setAddress(this.Address)
    this.Generating = new Generating(this.restURL)
    this.HDNode = new HDNode(this.Address)
    this.Mnemonic = new Mnemonic(this.Address)
    this.Price = new Price()
    this.Script = new Script()
    this.TransactionBuilder = TransactionBuilder
    this.TransactionBuilder.setAddress(this.Address)
    this.Util = new Util(this.restURL)
    this.Socket = Socket
    this.Wallet = Wallet
    this.Schnorr = new Schnorr(this.restURL)
  }
}

module.exports = BCHJS
