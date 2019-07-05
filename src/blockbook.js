/*
  This library interacts with the REST API endpoints in bch-api that communicate
  with the Blockbook API.
*/

const axios = require("axios")

class Blockbook {
  constructor(restURL) {
    this.restURL = restURL
  }

  async balance(address) {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response = await axios.get(
          `${this.restURL}blockbook/balance/${address}`
        )

        return response.data

        // Handle array of addresses.
      } else if (Array.isArray(address)) {
        /*
        const options = {
          method: "POST",
          url: `${this.restURL}blockbook/balance`,
          data: {
            addresses: address
          }
        }
        const response = await axios(options)
        */
        const response = await axios.post(`${this.restURL}blockbook/balance`, {
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
          `${this.restURL}blockbook/utxos/${address}`
        )
        return response.data
      } else if (Array.isArray(address)) {
        const options = {
          method: "POST",
          url: `${this.restURL}blockbook/utxos`,
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

module.exports = Blockbook
