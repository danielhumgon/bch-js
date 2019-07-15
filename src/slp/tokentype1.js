//const BCHJS = require("../bch-js")
//const bchjs = new BCHJS()

const Address = require("./address")

const BigNumber = require("bignumber.js")
const slpjs = require("slpjs")
const addy = new Address()

class TokenType1 {
  constructor(restURL) {
    this.restURL = restURL
  }

  async create(createConfig) {
    // validate address formats
    this.validateAddressFormat(createConfig)

    // determine mainnet/testnet
    const network = this.returnNetwork(createConfig.fundingAddress)

    // network appropriate BITBOX instance
    const BITBOX = this.returnBITBOXInstance(network)

    // slpjs BITBOX Network instance
    const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX)

    let batonReceiverAddress
    if (
      createConfig.batonReceiverAddress !== undefined &&
      createConfig.batonReceiverAddress !== "" &&
      createConfig.batonReceiverAddress !== null
    )
      batonReceiverAddress = createConfig.batonReceiverAddress
    else batonReceiverAddress = null

    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      createConfig.fundingAddress
    )

    let initialTokenQty = createConfig.initialTokenQty

    initialTokenQty = new BigNumber(initialTokenQty).times(
      10 ** createConfig.decimals
    )
    balances.nonSlpUtxos.forEach(txo => (txo.wif = createConfig.fundingWif))
    const genesisTxid = await bitboxNetwork.simpleTokenGenesis(
      createConfig.name,
      createConfig.symbol,
      initialTokenQty,
      createConfig.documentUri,
      createConfig.documentHash,
      createConfig.decimals,
      createConfig.tokenReceiverAddress,
      batonReceiverAddress,
      createConfig.bchChangeReceiverAddress,
      balances.nonSlpUtxos
    )
    return genesisTxid
  }

  async mint(mintConfig) {
    // validate address formats
    this.validateAddressFormat(mintConfig)

    // determine mainnet/testnet
    const network = this.returnNetwork(mintConfig.fundingAddress)

    // network appropriate BITBOX instance
    const BITBOX = this.returnBITBOXInstance(network)

    // slpjs BITBOX Network instance
    const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX)

    const batonReceiverAddress = addy.toSLPAddress(
      mintConfig.batonReceiverAddress
    )

    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      mintConfig.fundingAddress
    )
    if (!balances.slpBatonUtxos[mintConfig.tokenId])
      throw Error("You don't have the minting baton for this token")

    const tokenInfo = await bitboxNetwork.getTokenInformation(
      mintConfig.tokenId
    )

    const mintQty = new BigNumber(mintConfig.additionalTokenQty).times(
      10 ** tokenInfo.decimals
    )

    let inputUtxos = balances.slpBatonUtxos[mintConfig.tokenId]

    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

    inputUtxos.forEach(txo => (txo.wif = mintConfig.fundingWif))

    const mintTxid = await bitboxNetwork.simpleTokenMint(
      mintConfig.tokenId,
      mintQty,
      inputUtxos,
      mintConfig.tokenReceiverAddress,
      batonReceiverAddress,
      mintConfig.bchChangeReceiverAddress
    )
    return mintTxid
  }

  async send(sendConfig) {
    // validate address formats
    this.validateAddressFormat(sendConfig)

    // determine mainnet/testnet
    let network
    if (!Array.isArray(sendConfig.fundingAddress))
      network = this.returnNetwork(sendConfig.fundingAddress)
    else network = this.returnNetwork(sendConfig.fundingAddress[0])

    // network appropriate BITBOX instance
    const BITBOX = this.returnBITBOXInstance(network)

    // slpjs BITBOX Network instance
    const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX)

    const tokenId = sendConfig.tokenId

    const bchChangeReceiverAddress = addy.toSLPAddress(
      sendConfig.bchChangeReceiverAddress
    )

    const tokenInfo = await bitboxNetwork.getTokenInformation(tokenId)
    const tokenDecimals = tokenInfo.decimals
    if (!Array.isArray(sendConfig.fundingAddress)) {
      let amount = sendConfig.amount

      const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
        sendConfig.fundingAddress
      )

      if (!Array.isArray(amount)) {
        amount = new BigNumber(amount).times(10 ** tokenDecimals) // Don't forget to account for token precision
      } else {
        amount.forEach((amt, index) => {
          amount[index] = new BigNumber(amt).times(10 ** tokenDecimals) // Don't forget to account for token precision
        })
      }

      let inputUtxos = balances.slpTokenUtxos[tokenId]

      inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

      inputUtxos.forEach(txo => (txo.wif = sendConfig.fundingWif))

      const sendTxid = await bitboxNetwork.simpleTokenSend(
        tokenId,
        amount,
        inputUtxos,
        sendConfig.tokenReceiverAddress,
        bchChangeReceiverAddress
      )
      return sendTxid
    }

    const utxos = []
    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      sendConfig.fundingAddress
    )

    // Sign and add input token UTXOs
    const tokenBalances = balances.filter(i => {
      try {
        return i.result.slpTokenBalances[tokenId].isGreaterThan(0)
      } catch (_) {
        return false
      }
    })
    tokenBalances.map(i =>
      i.result.slpTokenUtxos[tokenId].forEach(
        j => (j.wif = sendConfig.fundingWif[i.address])
      )
    )
    tokenBalances.forEach(a => {
      try {
        a.result.slpTokenUtxos[tokenId].forEach(txo => utxos.push(txo))
      } catch (_) {}
    })

    // Sign and add input BCH (non-token) UTXOs
    const bchBalances = balances.filter(i => i.result.nonSlpUtxos.length > 0)
    bchBalances.map(i =>
      i.result.nonSlpUtxos.forEach(
        j => (j.wif = sendConfig.fundingWif[i.address])
      )
    )
    bchBalances.forEach(a =>
      a.result.nonSlpUtxos.forEach(txo => utxos.push(txo))
    )

    utxos.forEach(txo => {
      if (Array.isArray(sendConfig.fundingAddress)) {
        sendConfig.fundingAddress.forEach((address, index) => {
          if (txo.cashAddress === addy.toCashAddress(address))
            txo.wif = sendConfig.fundingWif[index]
        })
      }
    })

    let amount = sendConfig.amount
    if (!Array.isArray(amount)) {
      amount = new BigNumber(amount).times(10 ** tokenDecimals) // Don't forget to account for token precision
    } else {
      amount.forEach((amt, index) => {
        amount[index] = new BigNumber(amt).times(10 ** tokenDecimals) // Don't forget to account for token precision
      })
    }
    return await bitboxNetwork.simpleTokenSend(
      tokenId,
      amount,
      utxos,
      sendConfig.tokenReceiverAddress,
      bchChangeReceiverAddress
    )
  }

  async burn(burnConfig) {
    // validate address formats
    this.validateAddressFormat(burnConfig)

    // determine mainnet/testnet
    const network = this.returnNetwork(burnConfig.fundingAddress)

    // network appropriate BITBOX instance
    const BITBOX = this.returnBITBOXInstance(network)

    // slpjs BITBOX Network instance
    const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX)

    const bchChangeReceiverAddress = addy.toSLPAddress(
      burnConfig.bchChangeReceiverAddress
    )
    const tokenInfo = await bitboxNetwork.getTokenInformation(
      burnConfig.tokenId
    )
    const tokenDecimals = tokenInfo.decimals
    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(
      burnConfig.fundingAddress
    )
    const amount = new BigNumber(burnConfig.amount).times(10 ** tokenDecimals)
    let inputUtxos = balances.slpTokenUtxos[burnConfig.tokenId]

    inputUtxos = inputUtxos.concat(balances.nonSlpUtxos)

    inputUtxos.forEach(txo => (txo.wif = burnConfig.fundingWif))
    const burnTxid = await bitboxNetwork.simpleTokenBurn(
      burnConfig.tokenId,
      amount,
      inputUtxos,
      bchChangeReceiverAddress
    )
    return burnTxid
  }

  returnNetwork(address) {
    return addy.detectAddressNetwork(address)
  }

  returnBITBOXInstance(network) {
    //let tmpBITBOX

    let restURL
    if (network === "mainnet") restURL = "https://rest.bitcoin.com/v2/"
    else restURL = "https://trest.bitcoin.com/v2/"

    return new BITBOX({ restURL: restURL })
  }

  validateAddressFormat(config) {
    // validate address formats
    // fundingAddress, tokenReceiverAddress and batonReceiverAddress must be simpleledger format
    // bchChangeReceiverAddress can be either simpleledger or cashAddr format
    // validate fundingAddress format
    // single fundingAddress
    if (config.fundingAddress && !addy.isSLPAddress(config.fundingAddress))
      throw Error("Funding Address must be simpleledger format")

    // bulk fundingAddress
    if (config.fundingAddress && Array.isArray(config.fundingAddress)) {
      config.fundingAddress.forEach(address => {
        if (!addy.isSLPAddress(address))
          throw Error("Funding Address must be simpleledger format")
      })
    }

    // validate tokenReceiverAddress format
    // single tokenReceiverAddress
    if (
      config.tokenReceiverAddress &&
      !addy.isSLPAddress(config.tokenReceiverAddress)
    )
      throw Error("Token Receiver Address must be simpleledger format")

    // bulk tokenReceiverAddress
    if (
      config.tokenReceiverAddress &&
      Array.isArray(config.tokenReceiverAddress)
    ) {
      config.tokenReceiverAddress.forEach(address => {
        if (!addy.isSLPAddress(address))
          throw Error("Token Receiver Address must be simpleledger format")
      })
    }

    // validate bchChangeReceiverAddress format
    if (
      config.bchChangeReceiverAddress &&
      !addy.isCashAddress(config.bchChangeReceiverAddress)
    )
      throw Error("BCH Change Receiver Address must be cash address format")

    // validate batonReceiverAddress format
    if (
      config.batonReceiverAddress &&
      !addy.isSLPAddress(config.batonReceiverAddress)
    )
      throw Error("Baton Receiver Address must be simpleledger format")
  }
}

module.exports = TokenType1
