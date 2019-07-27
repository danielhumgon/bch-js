const axios = require("axios")

class Mining {
  constructor(restURL) {
    this.restURL = restURL
  }

  async getBlockTemplate(template_request) {
    try {
      const response = await axios.get(
        `${this.restURL}mining/getBlockTemplate/${template_request}`
      )
      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
  /**
   * @api Minning.getMiningInfo() Get Minning Info
   * @apiName getMiningInfo
   * @apiGroup Minning
   * @apiDescription Returns a json object containing mining-related information.
   *
   * @apiExample Example usage:
   * (async () => {
   * try {
   * let getMiningInfo = await bitbox.Mining.getMiningInfo();
   * console.log(getMiningInfo);
   * } catch(error) {
   * console.error(error)
   * }
   * })()
   */

  async getMiningInfo() {
    try {
      const response = await axios.get(`${this.restURL}mining/getMiningInfo`)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  /**
   * @api Minning.getNetworkHashps() Returns the estimated network hashes
   * @apiName getNetworkHashps
   * @apiGroup Minning
   * @apiDescription
   *  Returns the estimated network hashes per second based on the last n blocks. Pass in [blocks] to override # of blocks, -1 specifies since last difficulty change. Pass in [height] to estimate the network speed at the time when a certain block was found.
   *
   * @apiExample Example usage:
   * (async () => {
   * try {
   * let getNetworkHashps = await bitbox.Mining.getNetworkHashps();
   * console.log(getNetworkHashps);
   * } catch(error) {
   * console.error(error)
   * }
   * })()
   */

  async getNetworkHashps(nblocks = 120, height = 1) {
    try {
      const response = await axios.get(
        `${this.restURL}mining/getNetworkHashps?nblocks=${nblocks}&height=${height}`
      )
      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  async submitBlock(hex, parameters) {
    let path = `${this.restURL}mining/submitBlock/${hex}`
    if (parameters) path = `${path}?parameters=${parameters}`

    try {
      const response = await axios.post(path)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
}

module.exports = Mining
