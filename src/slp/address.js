const BCHJSAddress = require("../address")

const utils = require("slpjs").Utils

class Address extends BCHJSAddress {
  constructor(restURL) {
    super(restURL)
    this.restURL = restURL
  }

  toSLPAddress(address, prefix = true, regtest = false) {
    this._ensureValidAddress(address)
    const slpAddress = utils.toSlpAddress(address)
    if (prefix) return slpAddress
    return slpAddress.split(":")[1]
  }

  toCashAddress(address, prefix = true, regtest = false) {
    this._ensureValidAddress(address)
    const cashAddress = utils.toCashAddress(address)
    if (prefix) return cashAddress
    return cashAddress.split(":")[1]
  }

  toLegacyAddress(address) {
    this._ensureValidAddress(address)
    const cashAddr = utils.toCashAddress(address)
    return this.toLegacyAddress(cashAddr)
  }

  isLegacyAddress(address) {
    this._ensureValidAddress(address)
    return this.isLegacyAddress(address)
  }

  isCashAddress(address) {
    this._ensureValidAddress(address)
    if (utils.isSlpAddress(address)) return false

    return this.isCashAddress(address)
  }

  isSLPAddress(address) {
    this._ensureValidAddress(address)
    return utils.isSlpAddress(address)
  }

  isMainnetAddress(address) {
    this._ensureValidAddress(address)
    const cashaddr = utils.toCashAddress(address)
    return this.isMainnetAddress(cashaddr)
  }

  isTestnetAddress(address) {
    this._ensureValidAddress(address)
    const cashAddr = utils.toCashAddress(address)
    return this.isTestnetAddress(cashAddr)
  }

  isP2PKHAddress(address) {
    this._ensureValidAddress(address)
    const cashAddr = utils.toCashAddress(address)
    return this.isP2PKHAddress(cashAddr)
  }

  isP2SHAddress(address) {
    this._ensureValidAddress(address)
    const cashAddr = utils.toCashAddress(address)
    return this.isP2SHAddress(cashAddr)
  }

  detectAddressFormat(address) {
    this._ensureValidAddress(address)
    if (utils.isSlpAddress(address)) return "slpaddr"

    return this.detectAddressFormat(address)
  }

  detectAddressNetwork(address) {
    this._ensureValidAddress(address)
    const cashAddr = utils.toCashAddress(address)
    return this.detectAddressNetwork(cashAddr)
  }

  detectAddressType(address) {
    this._ensureValidAddress(address)
    const cashAddr = utils.toCashAddress(address)
    return this.detectAddressType(cashAddr)
  }
  /*
  async details(address) {
    let tmpBITBOX
    let network
    if (typeof address === "string")
      network = this.detectAddressNetwork(address)
    else network = this.detectAddressNetwork(address[0])

    if (network === "mainnet")
      tmpBITBOX = new BITBOX({ restURL: "https://rest.bitcoin.com/v2/" })
    else tmpBITBOX = new BITBOX({ restURL: "https://trest.bitcoin.com/v2/" })

    if (typeof address === "string") {
      const cashAddr = utils.toCashAddress(address)
      return tmpBITBOX.Address.details(cashAddr)
    }
    address = address.map(address => utils.toCashAddress(address))
    return tmpBITBOX.Address.details(address)
  }

  async utxo(address) {
    let tmpBITBOX
    let network
    if (typeof address === "string")
      network = this.detectAddressNetwork(address)
    else network = this.detectAddressNetwork(address[0])

    if (network === "mainnet")
      tmpBITBOX = new BITBOX({ restURL: "https://rest.bitcoin.com/v2/" })
    else tmpBITBOX = new BITBOX({ restURL: "https://trest.bitcoin.com/v2/" })

    if (typeof address === "string") {
      const cashAddr = utils.toCashAddress(address)
      return tmpBITBOX.Address.utxo(cashAddr)
    }
    address = address.map(address => utils.toCashAddress(address))
    return tmpBITBOX.Address.utxo(address)
  }

  async unconfirmed(address) {
    let tmpBITBOX
    let network
    if (typeof address === "string")
      network = this.detectAddressNetwork(address)
    else network = this.detectAddressNetwork(address[0])

    if (network === "mainnet")
      tmpBITBOX = new BITBOX({ restURL: "https://rest.bitcoin.com/v2/" })
    else tmpBITBOX = new BITBOX({ restURL: "https://trest.bitcoin.com/v2/" })

    if (typeof address === "string") {
      const cashAddr = utils.toCashAddress(address)
      return tmpBITBOX.Address.unconfirmed(cashAddr)
    }
    address = address.map(address => utils.toCashAddress(address))
    return tmpBITBOX.Address.unconfirmed(address)
  }

  async transactions(address) {
    let tmpBITBOX
    let network
    if (typeof address === "string")
      network = this.detectAddressNetwork(address)
    else network = this.detectAddressNetwork(address[0])

    if (network === "mainnet")
      tmpBITBOX = new BITBOX({ restURL: "https://rest.bitcoin.com/v2/" })
    else tmpBITBOX = new BITBOX({ restURL: "https://trest.bitcoin.com/v2/" })

    if (typeof address === "string") {
      const cashAddr = utils.toCashAddress(address)
      return tmpBITBOX.Address.transactions(cashAddr)
    }
    address = address.map(address => utils.toCashAddress(address))
    return tmpBITBOX.Address.transactions(address)
  }
*/
  _ensureValidAddress(address) {
    try {
      utils.toCashAddress(address)
    } catch (err) {
      throw new Error(
        `Invalid BCH address. Double check your address is valid: ${address}`
      )
    }
  }
}

module.exports = Address
