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
  /**
   * @api SLP.TokenType1.create() create() - Create a new SLP Token of Type 1.
   * @apiName create
   * @apiGroup SLP
   * @apiDescription Create a new SLP Token of Type 1.
   *
   * @apiExample Example usage:
   * (async function() {
   *   try {
   *     let token = await bchjs.SLP.TokenType1.create({
   *       fundingAddress: "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       fundingWif: "cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS",
   *       tokenReceiverAddress:
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       bchChangeReceiverAddress:
   *         "bchtest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcmf0pnpav",
   *       batonReceiverAddress:
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       decimals: 2,
   *       name: "Test SLP SDK Token",
   *       symbol: "GABRIEL",
   *       documentUri: "badger@bitcoin.com",
   *       documentHash: null,
   *       initialTokenQty: 1000
   *     });
   *     console.log(token);
   *   } catch (err) {
   *     console.log("ERROR: ", err);
   *   }
   * })();
   *
   * // returns
   * // a3787d6b170707c59920486e9e03ea99f589fe4939454d36053d84dfc7388384
   */
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
  /**
   * @api SLP.TokenType1.mint() mint() - Mint additional tokens of Type 1.
   * @apiName mint
   * @apiGroup SLP
   * @apiDescription Mint additional tokens of Type 1.
   *
   * @apiExample Example usage:
   * (async function() {
   *   try {
   *     let mint = await bchjs.SLP.TokenType1.mint({
   *       fundingAddress: "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       fundingWif: "cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS",
   *       tokenReceiverAddress:
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       batonReceiverAddress:
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       bchChangeReceiverAddress:
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       tokenId:
   *         "a3787d6b170707c59920486e9e03ea99f589fe4939454d36053d84dfc7388384",
   *       additionalTokenQty: 507
   *     });
   *     console.log(mint);
   *   } catch (err) {
   *     console.log("ERROR: ", err);
   *   }
   * })();
   *
   * // returns
   * 9d1595b34c488df7f26d39b5081e97c9939f4d8698ddbd86e5bbd3a54f95e96e
   */
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
  /**
   * @api SLP.TokenType1.send() send() - Send tokens of Type 1.
   * @apiName send
   * @apiGroup SLP
   * @apiDescription Send tokens of Type 1. one-to-one, one-to-many, many-to-many and many-to-one token transactions supported.
   *
   * @apiExample Example usage:
   * // one-to-one
   * (async function() {
   *   try {
   *     let send = await bchjs.SLP.TokenType1.send({
   *       fundingAddress: "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       fundingWif: "cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS",
   *       tokenReceiverAddress:
   *         "slptest:qrj9k49drcsk4al8wxn53hnkfvts6ew5jvv32952nh",
   *       bchChangeReceiverAddress:
   *         "bchtest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcmf0pnpav",
   *       tokenId:
   *         "a3787d6b170707c59920486e9e03ea99f589fe4939454d36053d84dfc7388384",
   *       amount: 1.01
   *     });
   *     console.log(send);
   *   } catch (err) {
   *     console.log("ERROR: ", err);
   *   }
   * })();
   * // returns
   * 251eb8a71184251453eb373c8912c8afd67e6820de5679de91b930689e776be1
   *
   * // one-to-many
   * (async function() {
   *   try {
   *     let send = await bchjs.SLP.TokenType1.send({
   *       fundingAddress: "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       fundingWif: "cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS",
   *       tokenReceiverAddress: [
   *         "slptest:qrj9k49drcsk4al8wxn53hnkfvts6ew5jvv32952nh",
   *         "slptest:qz7wjkg7s8e5khq2c6xeu6pcw28q4c0egglpawvw89",
   *         "slptest:qqwcgz4gl0sddcau57lygvycx7hgf2fjaylpalknp4",
   *         "slptest:qqvpqwvr9jpnhu0zq79th0fhtws9nhp5pyxnjjj2zx",
   *         "slptest:qrgcu3c2aqzp535s7cek5tdjgkpvh38dmg5h75q2c9",
   *         "slptest:qr0jjjjfatzg46adpa325grwdx39zfhdpgkxq2ejq9",
   *         "slptest:qppcj6hynmzx8nu0ewh7an454d3wt3ama5k7vua2nk",
   *         "slptest:qza6x2fef3jaxrr6vtkjkjsd8xcmwzaufqq66eur44",
   *         "slptest:qz9x0t4s5gzwtlgyx3avkq33ec2ph3g5tg0zws77qm",
   *         "slptest:qz4yf0k0z76wlmm4glvzrph2kld4h8y40ymn3wpaza",
   *         "slptest:qzxs4uqmjfrygkv0499ej0rvnqd6cj7y9yfsdwnnpk",
   *         "slptest:qqj98r7t8jalmepfc27776zvzdfwvxwhu58fsvqa7r",
   *         "slptest:qqrca59a98nxvq6zlqmzquerj5n68ntd3s5ac0elqg",
   *         "slptest:qpstysh49m30f2skd6hhjpr8wgp7jtxvqg27ww56up",
   *         "slptest:qqlesvq4ntx5day4fpunqewvlf7pdr9k2g424uvxj8",
   *         "slptest:qqez4680qx4rnpwm0xddwmd6v8dsr4x4rs9f2qmf8t",
   *         "slptest:qrfgwsahle0dfn7pd78rc6x496zgv96525nkr3agyg"
   *       ],
   *       bchChangeReceiverAddress:
   *         "bchtest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcmf0pnpav",
   *       tokenId:
   *         "a3787d6b170707c59920486e9e03ea99f589fe4939454d36053d84dfc7388384",
   *       amount: [
   *         1,
   *         2,
   *         3,
   *         4,
   *         5,
   *         6,
   *         7,
   *         8,
   *         9,
   *         10,
   *         11,
   *         12,
   *         13,
   *         14,
   *         15,
   *         16,
   *         17
   *       ]
   *     });
   *     console.log(send);
   *   } catch (err) {
   *     console.log("ERROR: ", err);
   *   }
   * })();
   * // returns
   * // 84a4b2a1ec002a769e5cf055a56f485a4652442b0bb8cae06f3ac4ee1ac6b49b
   *
   * // many-to-many
   * (async function() {
   *   try {
   *     let send = await bchjs.SLP.TokenType1.send({
   *       fundingAddress: [
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *         "slptest:qrj9k49drcsk4al8wxn53hnkfvts6ew5jvv32952nh"
   *       ],
   *       fundingWif: [
   *         "cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS",
   *         "cNVP2nTzUMFerfpjrTuDgoFGnKAfjZznKomknUVKQSdFHqK5cRc5"
   *       ],
   *       tokenReceiverAddress: [
   *         "qp8u8lsax86msxmvy236az4q2aq26pe2ng5dfkjsx2",
   *         "qqjdcjmqlenuas2qyj57n564s9rzushamcn9rg5ccl"
   *       ],
   *       bchChangeReceiverAddress:
   *         "bchtest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcmf0pnpav",
   *       tokenId:
   *         "47f4a3ecf16001d062852ecffac8d23cc2fce6816ea856b2ddc3638bae85cf98",
   *       amount: [1, 1]
   *     });
   *     console.log(send);
   *   } catch (err) {
   *     console.log("ERROR: ", err);
   *   }
   * })();
   * // returns
   * // c4b5b4c3536121f01705010ec7e4112ba05a45e151cc98a3e0378cd921a9f85f
   *
   * // many-to-one
   * (async function() {
   *   try {
   *     let send = await bchjs.SLP.TokenType1.send({
   *       fundingAddress: [
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *         "slptest:qrj9k49drcsk4al8wxn53hnkfvts6ew5jvv32952nh"
   *       ],
   *       fundingWif: [
   *         "cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS",
   *         "cNVP2nTzUMFerfpjrTuDgoFGnKAfjZznKomknUVKQSdFHqK5cRc5"
   *       ],
   *       tokenReceiverAddress: "qrrw0wkvyn4yrssprcqjrwthfz0e0edlmyj7gms7kj",
   *       bchChangeReceiverAddress:
   *         "bchtest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcmf0pnpav",
   *       tokenId:
   *         "47f4a3ecf16001d062852ecffac8d23cc2fce6816ea856b2ddc3638bae85cf98",
   *       amount: 12
   *     });
   *     console.log(send);
   *   } catch (err) {
   *     console.log("ERROR: ", err);
   *   }
   * })();
   * // returns
   * // d42b5e375025e4eece6437a060b7cc274bdc8143ccca51c290f2e76758c47a53
   */
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
  /**
   * @api SLP.TokenType1.burn() burn() - Burn an amount of tokens for an address by tokenId.
   * @apiName burn
   * @apiGroup SLP
   * @apiDescription Burn an amount of tokens for an address by tokenId.CAUTION: THIS WILL BURN AN AMOUNT OF YOUR TOKENS FOR A TOKENID. PLEASE USE WITH CARE
   *
   * @apiExample Example usage:
   * (async function() {
   *   try {
   *     let burn = await bchjs.SLP.TokenType1.burn({
   *       fundingAddress: "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03",
   *       fundingWif: "cUCSrdhu7mCzx4sWqL6irqzprkofxPmLHYgkSnG2WaWVqJDXtWRS",
   *       tokenId:
   *         "a3787d6b170707c59920486e9e03ea99f589fe4939454d36053d84dfc7388384",
   *       amount: 5.99,
   *       bchChangeReceiverAddress:
   *         "slptest:qq835u5srlcqwrtwt6xm4efwan30fxg9hcqag6fk03"
   *     });
   *     console.log(burn);
   *   } catch (err) {
   *     console.log("ERROR: ", err);
   *   }
   * })();
   *
   * // returns
   * 2c90f44dbb0a3257ded2c30d46d387490aee61eecd168534c8b645ffe21cbc50
   */
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
