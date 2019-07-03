//const Bitcoin = require("bitcoincashjs-lib")
const axios = require("axios")

class Transaction {
  constructor(restURL) {
    this.restURL = restURL
  }

  async details(txid) {
    try {
      // Handle single address.
      if (typeof txid === "string") {
        const response = await axios.get(
          `${this.restURL}insight/transaction/details/${txid}`
        )
        return response.data

        // Array of addresses
      } else if (Array.isArray(txid)) {
        const options = {
          method: "POST",
          url: `${this.restURL}insight/transaction/details`,
          data: {
            txids: txid
          }
        }
        const response = await axios(options)

        return response.data
      }

      throw new Error(`Input txid must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
}

module.exports = Transaction
