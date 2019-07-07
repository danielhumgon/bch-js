/*
  This library interacts with the REST API endpoints in bch-api that communicate
  with the Bitcore API.
*/

const axios = require("axios")

class Bitcore {
  constructor(restURL) {
    this.restURL = restURL
  }

  async balance(address) {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response = await axios.get(
          `${this.restURL}bitcore/balance/${address}`
        )

        return response.data

        // Handle array of addresses.
      } else if (Array.isArray(address)) {
        const response = await axios.post(`${this.restURL}bitcore/balance`, {
          addresses: address
        })

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  async utxo(address) {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response = await axios.get(
          `${this.restURL}bitcore/utxos/${address}`
        )
        return response.data
      } else if (Array.isArray(address)) {
        const response = await axios.post(`${this.restURL}bitcore/utxos`, {
          addresses: address
        })

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
}

module.exports = Bitcore
