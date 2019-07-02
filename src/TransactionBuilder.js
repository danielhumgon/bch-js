const Bitcoin = require("bitcoincashjs-lib")
const coininfo = require("coininfo")
const bip66 = require("bip66")
const bip68 = require("bc-bip68")

class TransactionBuilder {
  static setAddress(address) {
    TransactionBuilder._address = address
  }

  constructor(network = "mainnet") {
    let bitcoincash
    if (network === "bitcoincash" || network === "mainnet")
      bitcoincash = coininfo.bitcoincash.main
    else bitcoincash = coininfo.bitcoincash.test

    const bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS()
    this.transaction = new Bitcoin.TransactionBuilder(bitcoincashBitcoinJSLib)
    this.DEFAULT_SEQUENCE = 0xffffffff
    this.hashTypes = {
      SIGHASH_ALL: 0x01,
      SIGHASH_NONE: 0x02,
      SIGHASH_SINGLE: 0x03,
      SIGHASH_ANYONECANPAY: 0x80,
      SIGHASH_BITCOINCASH_BIP143: 0x40,
      ADVANCED_TRANSACTION_MARKER: 0x00,
      ADVANCED_TRANSACTION_FLAG: 0x01
    }
    this.signatureAlgorithms = {
      ECDSA: Bitcoin.ECSignature.ECDSA,
      SCHNORR: Bitcoin.ECSignature.SCHNORR
    }
    this.bip66 = bip66
    this.bip68 = bip68
    this.p2shInput = false
    this.tx
  }

  addInput(txHash, vout, sequence = this.DEFAULT_SEQUENCE, prevOutScript) {
    this.transaction.addInput(txHash, vout, sequence, prevOutScript)
  }

  addInputScript(vout, script) {
    this.tx = this.transaction.buildIncomplete()
    this.tx.setInputScript(vout, script)
    this.p2shInput = true
  }

  addInputScripts(scripts) {
    this.tx = this.transaction.buildIncomplete()
    scripts.forEach(script => {
      this.tx.setInputScript(script.vout, script.script)
    })
    this.p2shInput = true
  }

  addOutput(scriptPubKey, amount) {
    try {
      this.transaction.addOutput(
        TransactionBuilder._address.toLegacyAddress(scriptPubKey),
        amount
      )
    } catch (error) {
      this.transaction.addOutput(scriptPubKey, amount)
    }
  }

  setLockTime(locktime) {
    this.transaction.setLockTime(locktime)
  }

  sign(
    vin,
    keyPair,
    redeemScript,
    hashType = this.hashTypes.SIGHASH_ALL,
    value,
    signatureAlgorithm
  ) {
    let witnessScript

    this.transaction.sign(
      vin,
      keyPair,
      redeemScript,
      hashType,
      value,
      witnessScript,
      signatureAlgorithm
    )
  }

  build() {
    if (this.p2shInput === true) return this.tx

    return this.transaction.build()
  }
}

module.exports = TransactionBuilder
