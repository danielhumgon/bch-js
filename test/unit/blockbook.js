const chai = require("chai")
const assert = chai.assert
const BCHJS = require("../../src/bch-js")
const bchjs = new BCHJS()
const axios = require("axios")
const sinon = require("sinon")

const mockData = require("./fixtures/blockbook-mock")

describe(`#Blockbook`, () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.createSandbox()))
  afterEach(() => sandbox.restore())

  describe(`#Balance`, () => {
    it(`should GET balance for a single address`, async () => {
      // Stub the network call.
      sandbox.stub(axios, "get").resolves({ data: mockData.balance })

      const addr = "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf"

      const result = await bchjs.Blockbook.balance(addr)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAnyKeys(result, [
        "page",
        "totalPages",
        "itemsOnPage",
        "address",
        "balance",
        "totalReceived",
        "totalSent",
        "unconfirmedBalance",
        "unconfirmedTxs",
        "txs",
        "txids"
      ])
      assert.isArray(result.txids)
    })

    it(`should POST request balances for an array of addresses`, async () => {
      // Stub the network call.
      sandbox
        .stub(axios, "post")
        .resolves({ data: [mockData.balance, mockData.balance] })

      const addr = [
        "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf",
        "bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v"
      ]

      const result = await bchjs.Blockbook.balance(addr)
      //console.log(`result: ${util.inspect(result)}`)

      assert.isArray(result)
      assert.hasAnyKeys(result[0], [
        "page",
        "totalPages",
        "itemsOnPage",
        "address",
        "balance",
        "totalReceived",
        "totalSent",
        "unconfirmedBalance",
        "unconfirmedTxs",
        "txs",
        "txids"
      ])
      assert.isArray(result[0].txids)
    })
    /*
    it(`should throw an error for improper input`, async () => {
      try {
        const addr = 12345

        await bchjs.Blockbook.balance(addr)
        assert.equal(true, false, "Unexpected result!")
      } catch (err) {
        //console.log(`err: `, err)
        assert.include(
          err.message,
          `Input address must be a string or array of strings`
        )
      }
    })

    it(`should throw error on array size rate limit`, async () => {
      try {
        const addr = []
        for (let i = 0; i < 25; i++)
          addr.push("bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf")

        const result = await bchjs.Blockbook.balance(addr)

        console.log(`result: ${util.inspect(result)}`)
        assert.equal(true, false, "Unexpected result!")
      } catch (err) {
        assert.hasAnyKeys(err, ["error"])
        assert.include(err.error, "Array too large")
      }
    })
    */
  })
  /*
  describe(`#utxo`, () => {
    it(`should GET utxos for a single address`, async () => {
      const addr = "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf"

      const result = await bchjs.Blockbook.utxo(addr)
      //console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.hasAnyKeys(result[0], [
        "txid",
        "vout",
        "value",
        "height",
        "confirmations"
      ])
    })

    it(`should POST utxo details for an array of addresses`, async () => {
      const addr = [
        "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf",
        "bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v"
      ]

      const result = await bchjs.Insight.Address.utxo(addr)
      //console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.hasAnyKeys(result[0], ["utxos", "legacyAddress", "cashAddress"])
      assert.isArray(result[0].utxos)

      assert.hasAnyKeys(result[0].utxos[0], [
        "txid",
        "vout",
        "amount",
        "satoshis",
        "height",
        "confirmations"
      ])
    })

    it(`should throw an error for improper input`, async () => {
      try {
        const addr = 12345

        await bchjs.Insight.Address.utxo(addr)
        assert.equal(true, false, "Unexpected result!")
      } catch (err) {
        //console.log(`err: `, err)
        assert.include(
          err.message,
          `Input address must be a string or array of strings`
        )
      }
    })

    it(`should throw error on array size rate limit`, async () => {
      try {
        const addr = []
        for (let i = 0; i < 25; i++)
          addr.push("bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf")

        const result = await bchjs.Insight.Address.utxo(addr)

        console.log(`result: ${util.inspect(result)}`)
        assert.equal(true, false, "Unexpected result!")
      } catch (err) {
        assert.hasAnyKeys(err, ["error"])
        assert.include(err.error, "Array too large")
      }
    })
  })
})

describe("#details", () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.sandbox.create()))
  afterEach(() => sandbox.restore())

  it("should get details", done => {
    const data = {
      legacyAddress: "3CnzuFFbtgVyHNiDH8BknGo3PQ3dpdThgJ",
      cashAddress: "bitcoincash:ppuukp49np467kyzxl0fkla34rmgcddhvc33ce2d6l",
      balance: 300.0828874,
      balanceSat: 30008288740,
      totalReceived: 12945.45174649,
      totalReceivedSat: 1294545174649,
      totalSent: 12645.36885909,
      totalSentSat: 1264536885909,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 1042,
      transactions: [
        "b29425a876f62e114508e67e66b5eb1ab0d320d7c9a57fb0ece086a36e2b7309"
      ]
    }

    const resolved = new Promise(r => r({ data: data }))
    sandbox.stub(axios, "get").returns(resolved)

    bchjs.Insight.Address.details(
      "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf"
    )
      .then(result => {
        assert.deepEqual(data, result)
      })
      .then(done, done)
  })
})

describe("#utxo", () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.sandbox.create()))
  afterEach(() => sandbox.restore())

  it("should get utxo", done => {
    const data = [
      {
        legacyAddress: "3CnzuFFbtgVyHNiDH8BknGo3PQ3dpdThgJ",
        cashAddress: "bitcoincash:ppuukp49np467kyzxl0fkla34rmgcddhvc33ce2d6l",
        txid:
          "6f56254424378d6914cebd097579c70664843e5876ca86f0bf412ba7f3928326",
        vout: 0,
        scriptPubKey: "a91479cb06a5986baf588237de9b7fb1a8f68c35b76687",
        amount: 12.5002911,
        satoshis: 1250029110,
        height: 528745,
        confirmations: 17
      },
      {
        legacyAddress: "3CnzuFFbtgVyHNiDH8BknGo3PQ3dpdThgJ",
        cashAddress: "bitcoincash:ppuukp49np467kyzxl0fkla34rmgcddhvc33ce2d6l",
        txid:
          "b29425a876f62e114508e67e66b5eb1ab0d320d7c9a57fb0ece086a36e2b7309",
        vout: 0,
        scriptPubKey: "a91479cb06a5986baf588237de9b7fb1a8f68c35b76687",
        amount: 12.50069247,
        satoshis: 1250069247,
        height: 528744,
        confirmations: 18
      }
    ]
    const resolved = new Promise(r => r({ data: data }))
    sandbox.stub(axios, "get").returns(resolved)

    bchjs.Insight.Address.utxo(
      "bitcoincash:ppuukp49np467kyzxl0fkla34rmgcddhvc33ce2d6l"
    )
      .then(result => {
        assert.deepEqual(data, result)
      })
      .then(done, done)
  })
})
*/
})
