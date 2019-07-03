const axios = require("axios")
//const Bitcoin = require("bitcoincashjs-lib")
//const cashaddr = require("cashaddrjs")
//const coininfo = require("coininfo")

class Address {
  constructor(restURL) {
    this.restURL = restURL
  }

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
