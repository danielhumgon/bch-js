const Bitcoin = require("bitcoincashjs-lib")
const coininfo = require("coininfo")

class ECPair {
  static setAddress(address) {
    ECPair._address = address
  }

  static fromWIF(privateKeyWIF) {
    let network
    if (privateKeyWIF[0] === "L" || privateKeyWIF[0] === "K")
      network = "mainnet"
    else if (privateKeyWIF[0] === "c") network = "testnet"

    let bitcoincash
    if (network === "mainnet") bitcoincash = coininfo.bitcoincash.main
    else bitcoincash = coininfo.bitcoincash.test

    const bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS()

    return Bitcoin.ECPair.fromWIF(privateKeyWIF, bitcoincashBitcoinJSLib)
  }

  static toWIF(ecpair) {
    return ecpair.toWIF()
  }

  static sign(ecpair, buffer) {
    return ecpair.sign(buffer)
  }

  static verify(ecpair, buffer, signature) {
    return ecpair.verify(buffer, signature)
  }

  static fromPublicKey(pubkeyBuffer) {
    return Bitcoin.ECPair.fromPublicKeyBuffer(pubkeyBuffer)
  }

  static toPublicKey(ecpair) {
    return ecpair.getPublicKeyBuffer()
  }

  static toLegacyAddress(ecpair) {
    return ecpair.getAddress()
  }

  static toCashAddress(ecpair, regtest = false) {
    return ECPair._address.toCashAddress(ecpair.getAddress(), true, regtest)
  }
}

module.exports = ECPair
