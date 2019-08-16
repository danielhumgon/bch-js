const axios = require("axios")
//const Bitcoin = require("bitcoincashjs-lib")
//const cashaddr = require("cashaddrjs")
//const coininfo = require("coininfo")

class Address {
  constructor(restURL) {
    this.restURL = restURL
  }
  /**
   * @api Insight.Address.details() details() - Details about an address.
   * @apiName details
   * @apiGroup Insight
   * @apiDescription Return details about an address including balance.
   *
   * @apiExample Example usage:
   * (async () => {
   *   try {
   *     let details = await bchjs.Insight.Address.details('1BFHGm4HzqgXXyNX8n7DsQno5DAC4iLMRA');
   *     console.log(details)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // {
   * //   "addrStr": "1BFHGm4HzqgXXyNX8n7DsQno5DAC4iLMRA",
   * //   "balance": 0.36781097,
   * //   "balanceSat": 36781097,
   * //   "totalReceived": 0.36781097,
   * //   "totalReceivedSat": 36781097,
   * //   "totalSent": 0,
   * //   "totalSentSat": 0,
   * //   "unconfirmedBalance": 0,
   * //   "unconfirmedBalanceSat": 0,
   * //   "unconfirmedTxAppearances": 0,
   * //   "txAppearances": 7,
   * //   "transactions": [
   * //     "f737485aaee3c10b13013fa109bb6294b099246134ca9885f4cc332dbc6c9bb4",
   * //     "decd5b9c0c959e4e543182093e8f7f8bc7a6ecd96a8a062daaeff3667f8feca7",
   * //     "94e69a627a34ae27fca81d15fff4323a7ce1f7c275c7485762ce018221017632",
   * //     "e67c70787af7f3506263c9eda007f3d2d24bd750ff95b5c50a120d9118dfd807",
   * //     "8e5e00704a147d54028f94d52df7730e821b9c6cd4bd29494e5636f49c199d6a",
   * //     "15102827c108566ea5daf725c09079c1a3f42ef99d1eb68ea8c584f7b16ab87a",
   * //     "cc27be8846276612dfce5924b7be96556212f0f0e62bd17641732175edb9911e"
   * //   ]
   * // }
   *
   * (async () => {
   *   try {
   *     let details = await bchjs.Insight.Address.details(['1BFHGm4HzqgXXyNX8n7DsQno5DAC4iLMRA', "bitcoincash:qp7ekaepv3wf2nq035hevcma4x9sxmp3w56048g6ra"]);
   *     console.log(details)
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // [ { balance: 0.36781097,
   * //   balanceSat: 36781097,
   * //   totalReceived: 0.36781097,
   * //   totalReceivedSat: 36781097,
   * //   totalSent: 0,
   * //   totalSentSat: 0,
   * //   unconfirmedBalance: 0,
   * //   unconfirmedBalanceSat: 0,
   * //   unconfirmedTxAppearances: 0,
   * //   txAppearances: 7,
   * //   transactions:
   * //    [ 'f737485aaee3c10b13013fa109bb6294b099246134ca9885f4cc332dbc6c9bb4',
   * //      'decd5b9c0c959e4e543182093e8f7f8bc7a6ecd96a8a062daaeff3667f8feca7',
   * //      '94e69a627a34ae27fca81d15fff4323a7ce1f7c275c7485762ce018221017632',
   * //      'e67c70787af7f3506263c9eda007f3d2d24bd750ff95b5c50a120d9118dfd807',
   * //      '8e5e00704a147d54028f94d52df7730e821b9c6cd4bd29494e5636f49c199d6a',
   * //      '15102827c108566ea5daf725c09079c1a3f42ef99d1eb68ea8c584f7b16ab87a',
   * //      'cc27be8846276612dfce5924b7be96556212f0f0e62bd17641732175edb9911e' ],
   * //   legacyAddress: '1BFHGm4HzqgXXyNX8n7DsQno5DAC4iLMRA',
   * //   cashAddress: 'bitcoincash:qpcxf2sv9hjw08nvpgffpamfus9nmksm3chv5zqtnz' },
   * // { balance: 0,
   * //   balanceSat: 0,
   * //   totalReceived: 0,
   * //   totalReceivedSat: 0,
   * //   totalSent: 0,
   * //   totalSentSat: 0,
   * //   unconfirmedBalance: 0,
   * //   unconfirmedBalanceSat: 0,
   * //   unconfirmedTxAppearances: 0,
   * //   txAppearances: 0,
   * //   transactions: [],
   * //   legacyAddress: '1CT9huFgxMFveRvzZ7zPPJNoaMm2Fo64VH',
   * //   cashAddress: 'bitcoincash:qp7ekaepv3wf2nq035hevcma4x9sxmp3w56048g6ra' } ]
   */
  // Translate address from any address format into a specific format.
  async details(address) {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response = await axios.get(
          `${this.restURL}insight/address/details/${address}`
        )

        return response.data

        // Handle array of addresses.
      } else if (Array.isArray(address)) {
        const options = {
          method: "POST",
          url: `${this.restURL}insight/address/details`,
          data: {
            addresses: address
          }
        }
        const response = await axios(options)

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
  /**
   * @api Insight.Address.utxo() utxo() - Get list of uxto for address.
   * @apiName utxo
   * @apiGroup Insight
   * @apiDescription Return list of uxto for address. This includes confirmed and unconfirmed utxos.
   *
   * @apiExample Example usage:
   *    (async () => {
   *   try {
   *     let utxo = await bchjs.Insight.Address.utxo('1M1FYu4zuVaxRPWLZG5CnP8qQrZaqu6c2L');
   *     console.log(utxo);
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // {
   * //   "utxos": [
   * //     {
   * //       "txid": "27ec8512c1a9ee9e9ae9b98eb60375f1d2bd60e2e76a1eff5a45afdbc517cf9c",
   * //       "vout": 0,
   * //       "amount": 0.001,
   * //       "satoshis": 100000,
   * //       "height": 560430,
   * //       "confirmations": 5163
   * //     },
   * //     {
   * //       "txid": "6e1ae1bf7db6de799ec1c05ab2816ac65549bd80141567af088e6f291385b07d",
   * //       "vout": 0,
   * //       "amount": 0.0013,
   * //       "satoshis": 130000,
   * //       "height": 560039,
   * //       "confirmations": 5554
   * //     }
   * //   ],
   * //   "legacyAddress": "1M1FYu4zuVaxRPWLZG5CnP8qQrZaqu6c2L",
   * //   "cashAddress": "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf",
   * //   "scriptPubKey": "76a914db6ea94fa26b7272dc5e1487c35f258391e0f38788ac"
   * // }
   *
   * (async () => {
   *   try {
   *     let utxo = await bchjs.Insight.Address.utxo([
   *       "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf",
   *       "bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v"
   *     ]);
   *     console.log(utxo);
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // [
   * //   {
   * //     "utxos": [
   * //       {
   * //         "txid": "27ec8512c1a9ee9e9ae9b98eb60375f1d2bd60e2e76a1eff5a45afdbc517cf9c",
   * //         "vout": 0,
   * //         "amount": 0.001,
   * //         "satoshis": 100000,
   * //         "height": 560430,
   * //         "confirmations": 5163
   * //       },
   * //       {
   * //         "txid": "6e1ae1bf7db6de799ec1c05ab2816ac65549bd80141567af088e6f291385b07d",
   * //         "vout": 0,
   * //         "amount": 0.0013,
   * //         "satoshis": 130000,
   * //         "height": 560039,
   * //         "confirmations": 5554
   * //       }
   * //     ],
   * //     "legacyAddress": "1M1FYu4zuVaxRPWLZG5CnP8qQrZaqu6c2L",
   * //     "cashAddress": "bitcoincash:qrdka2205f4hyukutc2g0s6lykperc8nsu5u2ddpqf",
   * //     "scriptPubKey": "76a914db6ea94fa26b7272dc5e1487c35f258391e0f38788ac"
   * //   },
   * //   {
   * //     "utxos": [],
   * //     "legacyAddress": "19LXyLnux1tbTdHnMuYAgDZ81ZQDWEi12g",
   * //     "cashAddress": "bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v"
   * //   }
   * // ]
   */
  async utxo(address) {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response = await axios.get(
          `${this.restURL}insight/address/utxo/${address}`
        )
        return response.data
      } else if (Array.isArray(address)) {
        const options = {
          method: "POST",
          url: `${this.restURL}insight/address/utxo`,
          data: {
            addresses: address
          }
        }
        const response = await axios(options)

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
  /**
   * @api Insight.Address.unconfirmed() unconfirmed() - Get  list of unconfirmed transactions.
   * @apiName unconfirmed
   * @apiGroup Insight
   * @apiDescription Return list of unconfirmed transactions for address.
   *
   * @apiExample Example usage:
   * (async () => {
   *   try {
   *     let unconfirmed = await bchjs.Insight.Address.unconfirmed('1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R');
   *     console.log(unconfirmed);
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // {
   * //   "utxos": [
   * //     {
   * //       "address": "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R",
   * //       "txid": "5ddf277cecefab4bb75fb5d6ba21170cec756ef28a045cb4ec45ccffda28cdaf",
   * //       "vout": 0,
   * //       "scriptPubKey": "76a914bcbc83f8fadb704a6aeccf38079e428da445b11e88ac",
   * //       "amount": 0.0001,
   * //       "satoshis": 10000,
   * //       "confirmations": 0,
   * //       "ts": 1547670883
   * //     }
   * //   ],
   * //   "legacyAddress": "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R",
   * //   "cashAddress": "bitcoincash:qz7teqlcltdhqjn2an8nspu7g2x6g3d3rcq8nk4nzs"
   * // }
   *
   * (async () => {
   *   try {
   *     let unconfirmed = await bchjs.Insight.Address.unconfirmed(['1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R', "bitcoincash:qqcp8fw06dmjd2gnfanpwytj7q93w408nv7usdqgsk"])
   *     console.log(unconfirmed);
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // [
   * //   {
   * //     "utxos": [
   * //       {
   * //         "address": "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R",
   * //         "txid": "5ddf277cecefab4bb75fb5d6ba21170cec756ef28a045cb4ec45ccffda28cdaf",
   * //         "vout": 0,
   * //         "scriptPubKey": "76a914bcbc83f8fadb704a6aeccf38079e428da445b11e88ac",
   * //         "amount": 0.0001,
   * //         "satoshis": 10000,
   * //         "confirmations": 0,
   * //         "ts": 1547670883
   * //       }
   * //     ],
   * //     "legacyAddress": "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R",
   * //     "cashAddress": "bitcoincash:qz7teqlcltdhqjn2an8nspu7g2x6g3d3rcq8nk4nzs"
   * //   },
   * //   {
   * //     "utxos": [
   * //       {
   * //         "address": "15PCyMYPK6EX4xGenwG55FwdNnuyoHzYAX",
   * //         "txid": "f15ea5a836165bff9d711e9a1340e23554e28e03239aa3f4f9951c11ca1b6962",
   * //         "vout": 0,
   * //         "scriptPubKey": "76a9143013a5cfd37726a9134f66171172f00b1755e79b88ac",
   * //         "amount": 0.0001,
   * //         "satoshis": 10000,
   * //         "confirmations": 0,
   * //         "ts": 1547670908
   * //       }
   * //     ],
   * //     "legacyAddress": "15PCyMYPK6EX4xGenwG55FwdNnuyoHzYAX",
   * //     "cashAddress": "bitcoincash:qqcp8fw06dmjd2gnfanpwytj7q93w408nv7usdqgsk"
   * //   }
   * // ]
   */
  async unconfirmed(address) {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response = await axios.get(
          `${this.restURL}insight/address/unconfirmed/${address}`
        )
        return response.data

        // Handle an array of addresses
      } else if (Array.isArray(address)) {
        const options = {
          method: "POST",
          url: `${this.restURL}insight/address/unconfirmed`,
          data: {
            addresses: address
          }
        }
        const response = await axios(options)

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
  /**
   * @api Address.Insight.transactions() transactions() - Get decoded transactions for an address.
   * @apiName transactions
   * @apiGroup Insight
   * @apiDescription Returns decoded transactions for an address.
   *
   * @apiExample Example usage:
   * (async () => {
   *   try {
   *     let transaction = await bchjs.Insight.Address.utxo('1M1FYu4zuVaxRPWLZG5CnP8qQrZaqu6c2L')
   *     console.log(transaction);
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // {
   * //   "pagesTotal": 1,
   * //   "txs": [
   * //     {
   * //       "txid": "5ddf277cecefab4bb75fb5d6ba21170cec756ef28a045cb4ec45ccffda28cdaf",
   * //       "version": 2,
   * //       "locktime": 0,
   * //       "vin": [
   * //         {
   * //           "txid": "d0ff03c2429810991e8e23cfe2f253891eaae391bcbfd61706d340d9d649abea",
   * //           "vout": 0,
   * //           "sequence": 4294967295,
   * //           "n": 0,
   * //           "scriptSig": {
   * //             "hex": "483045022100fc121a12774e7f212f42898ea123ecc03099dc610a48627649f58490f183027b0220113964a117dc5aaed7c76a569a287797ccffad192cc346114340e59a706a1cd841210242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd",
   * //             "asm": "3045022100fc121a12774e7f212f42898ea123ecc03099dc610a48627649f58490f183027b0220113964a117dc5aaed7c76a569a287797ccffad192cc346114340e59a706a1cd8[ALL|FORKID] 0242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd"
   * //           },
   * //           "addr": "1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL",
   * //           "valueSat": 3466913,
   * //           "value": 0.03466913,
   * //           "doubleSpentTxID": null
   * //         }
   * //       ],
   * //       "vout": [
   * //         {
   * //           "value": "0.00010000",
   * //           "n": 0,
   * //           "scriptPubKey": {
   * //             "hex": "76a914bcbc83f8fadb704a6aeccf38079e428da445b11e88ac",
   * //             "asm": "OP_DUP OP_HASH160 bcbc83f8fadb704a6aeccf38079e428da445b11e OP_EQUALVERIFY OP_CHECKSIG",
   * //             "addresses": [
   * //               "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R"
   * //             ],
   * //             "type": "pubkeyhash"
   * //           },
   * //           "spentTxId": null,
   * //           "spentIndex": null,
   * //           "spentHeight": null
   * //         },
   * //         {
   * //           "value": "0.03456687",
   * //           "n": 1,
   * //           "scriptPubKey": {
   * //             "hex": "76a914a8f9b1307fa412da6a909f08930e5a502d27a74a88ac",
   * //             "asm": "OP_DUP OP_HASH160 a8f9b1307fa412da6a909f08930e5a502d27a74a OP_EQUALVERIFY OP_CHECKSIG",
   * //             "addresses": [
   * //               "1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL"
   * //             ],
   * //             "type": "pubkeyhash"
   * //           },
   * //           "spentTxId": null,
   * //           "spentIndex": null,
   * //           "spentHeight": null
   * //         }
   * //       ],
   * //       "blockheight": -1,
   * //       "confirmations": 0,
   * //       "time": 1547674527,
   * //       "valueOut": 0.03466687,
   * //       "size": 226,
   * //       "valueIn": 0.03466913,
   * //       "fees": 0.00000226
   * //     }
   * //   ],
   * //   "legacyAddress": "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R",
   * //   "cashAddress": "bitcoincash:qz7teqlcltdhqjn2an8nspu7g2x6g3d3rcq8nk4nzs",
   * //   "currentPage": 0
   * // }
   *
   * (async () => {
   *   try {
   *     let transaction = await bchjs.Insight.Address.transactions([
   *       "bitcoincash:qz7teqlcltdhqjn2an8nspu7g2x6g3d3rcq8nk4nzs",
   *       "bitcoincash:qqcp8fw06dmjd2gnfanpwytj7q93w408nv7usdqgsk"
   *     ]);
   *     console.log(transaction);
   *   } catch(error) {
   *    console.error(error)
   *   }
   * })()
   *
   * // [
   * //   {
   * //     "pagesTotal": 1,
   * //     "txs": [
   * //       {
   * //         "txid": "5ddf277cecefab4bb75fb5d6ba21170cec756ef28a045cb4ec45ccffda28cdaf",
   * //         "version": 2,
   * //         "locktime": 0,
   * //         "vin": [
   * //           {
   * //             "txid": "d0ff03c2429810991e8e23cfe2f253891eaae391bcbfd61706d340d9d649abea",
   * //             "vout": 0,
   * //             "sequence": 4294967295,
   * //             "n": 0,
   * //             "scriptSig": {
   * //               "hex": "483045022100fc121a12774e7f212f42898ea123ecc03099dc610a48627649f58490f183027b0220113964a117dc5aaed7c76a569a287797ccffad192cc346114340e59a706a1cd841210242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd",
   * //               "asm": "3045022100fc121a12774e7f212f42898ea123ecc03099dc610a48627649f58490f183027b0220113964a117dc5aaed7c76a569a287797ccffad192cc346114340e59a706a1cd8[ALL|FORKID] 0242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd"
   * //             },
   * //             "addr": "1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL",
   * //             "valueSat": 3466913,
   * //             "value": 0.03466913,
   * //             "doubleSpentTxID": null
   * //           }
   * //         ],
   * //         "vout": [
   * //           {
   * //             "value": "0.00010000",
   * //             "n": 0,
   * //             "scriptPubKey": {
   * //               "hex": "76a914bcbc83f8fadb704a6aeccf38079e428da445b11e88ac",
   * //               "asm": "OP_DUP OP_HASH160 bcbc83f8fadb704a6aeccf38079e428da445b11e OP_EQUALVERIFY OP_CHECKSIG",
   * //               "addresses": [
   * //                 "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R"
   * //               ],
   * //               "type": "pubkeyhash"
   * //             },
   * //             "spentTxId": null,
   * //             "spentIndex": null,
   * //             "spentHeight": null
   * //           },
   * //           {
   * //             "value": "0.03456687",
   * //             "n": 1,
   * //             "scriptPubKey": {
   * //               "hex": "76a914a8f9b1307fa412da6a909f08930e5a502d27a74a88ac",
   * //               "asm": "OP_DUP OP_HASH160 a8f9b1307fa412da6a909f08930e5a502d27a74a OP_EQUALVERIFY OP_CHECKSIG",
   * //               "addresses": [
   * //                 "1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL"
   * //               ],
   * //               "type": "pubkeyhash"
   * //             },
   * //             "spentTxId": null,
   * //             "spentIndex": null,
   * //             "spentHeight": null
   * //           }
   * //         ],
   * //         "blockheight": -1,
   * //         "confirmations": 0,
   * //         "time": 1547674527,
   * //         "valueOut": 0.03466687,
   * //         "size": 226,
   * //         "valueIn": 0.03466913,
   * //         "fees": 0.00000226
   * //       }
   * //     ],
   * //     "legacyAddress": "1JCwsMQtiV85fGjps4zXceaCCgxpQ1u84R",
   * //     "cashAddress": "bitcoincash:qz7teqlcltdhqjn2an8nspu7g2x6g3d3rcq8nk4nzs",
   * //     "currentPage": 0
   * //   },
   * //   {
   * //     "pagesTotal": 1,
   * //     "txs": [
   * //       {
   * //         "txid": "f15ea5a836165bff9d711e9a1340e23554e28e03239aa3f4f9951c11ca1b6962",
   * //         "version": 2,
   * //         "locktime": 0,
   * //         "vin": [
   * //           {
   * //             "txid": "5ddf277cecefab4bb75fb5d6ba21170cec756ef28a045cb4ec45ccffda28cdaf",
   * //             "vout": 1,
   * //             "sequence": 4294967295,
   * //             "n": 0,
   * //             "scriptSig": {
   * //               "hex": "47304402206124fca6aecc35e48b5d1293bd97cadb39f830308c75331b3e5fd2e6806efe9b0220014cf3ecf0be1cb1bee7e362257b33e0905451d44f0902b13ada2765d53332d741210242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd",
   * //               "asm": "304402206124fca6aecc35e48b5d1293bd97cadb39f830308c75331b3e5fd2e6806efe9b0220014cf3ecf0be1cb1bee7e362257b33e0905451d44f0902b13ada2765d53332d7[ALL|FORKID] 0242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd"
   * //             },
   * //             "addr": "1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL",
   * //             "valueSat": 3456687,
   * //             "value": 0.03456687,
   * //             "doubleSpentTxID": null
   * //           }
   * //         ],
   * //         "vout": [
   * //           {
   * //             "value": "0.00010000",
   * //             "n": 0,
   * //             "scriptPubKey": {
   * //               "hex": "76a9143013a5cfd37726a9134f66171172f00b1755e79b88ac",
   * //               "asm": "OP_DUP OP_HASH160 3013a5cfd37726a9134f66171172f00b1755e79b OP_EQUALVERIFY OP_CHECKSIG",
   * //               "addresses": [
   * //                 "15PCyMYPK6EX4xGenwG55FwdNnuyoHzYAX"
   * //               ],
   * //               "type": "pubkeyhash"
   * //             },
   * //             "spentTxId": null,
   * //             "spentIndex": null,
   * //             "spentHeight": null
   * //           },
   * //           {
   * //             "value": "0.03446461",
   * //             "n": 1,
   * //             "scriptPubKey": {
   * //               "hex": "76a914a8f9b1307fa412da6a909f08930e5a502d27a74a88ac",
   * //               "asm": "OP_DUP OP_HASH160 a8f9b1307fa412da6a909f08930e5a502d27a74a OP_EQUALVERIFY OP_CHECKSIG",
   * //               "addresses": [
   * //                 "1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL"
   * //               ],
   * //               "type": "pubkeyhash"
   * //             },
   * //             "spentTxId": null,
   * //             "spentIndex": null,
   * //             "spentHeight": null
   * //           }
   * //         ],
   * //         "blockheight": -1,
   * //         "confirmations": 0,
   * //         "time": 1547674527,
   * //         "valueOut": 0.03456461,
   * //         "size": 225,
   * //         "valueIn": 0.03456687,
   * //         "fees": 0.00000226
   * //       }
   * //     ],
   * //     "legacyAddress": "15PCyMYPK6EX4xGenwG55FwdNnuyoHzYAX",
   * //     "cashAddress": "bitcoincash:qqcp8fw06dmjd2gnfanpwytj7q93w408nv7usdqgsk",
   * //     "currentPage": 0
   * //   }
   * // ]
   */
  async transactions(address) {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response = await axios.get(
          `${this.restURL}insight/address/transactions/${address}`
        )
        return response.data

        // Handle an array of addresses
      } else if (Array.isArray(address)) {
        const options = {
          method: "POST",
          url: `${this.restURL}insight/address/transactions`,
          data: {
            addresses: address
          }
        }
        const response = await axios(options)

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
}

module.exports = Address
