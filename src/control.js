const axios = require("axios")
class Control {
  constructor(restURL) {
    this.restURL = restURL
  }

  /**
   * @api Control.getInfo() Get full node info
   * @apiName getInfo
   * @apiGroup Control
   * @apiDescription Returns an object containing various state info.
   *
   * @apiExample Example usage:
   * (async () => {
   *  try {
   *    let getInfo = await bitbox.Control.getInfo();
   *    console.log(getInfo);
   *  } catch(error) {
   *    console.error(error)
   *    }
   *  })()
   *
   * // {
   * //   version: 170000,
   * //   protocolversion: 70015,
   * //   blocks: 529235,
   * //   timeoffset: 0,
   * //   connections: 35,
   * //   proxy: '',
   * //   difficulty: 702784497476.8376,
   * //   testnet: false,
   * //   paytxfee: 0,
   * //   relayfee: 0.00001,
   * //   errors: ''
   * // }
   */
  async getInfo() {
    try {
      const response = await axios.get(`${this.restURL}control/getInfo`)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  async getNetworkInfo() {
    try {
      const response = await axios.get(`${this.restURL}control/getNetworkInfo`)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  async getMemoryInfo() {
    try {
      const response = await axios.get(`${this.restURL}control/getMemoryInfo`)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
  //
  // stop() {
  //   // Stop Bitcoin Cash server.
  //   return axios.post(`${this.restURL}control/stop`)
  //   .then((response) => {
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     return JSON.stringify(error.response.data.error.message);
  //   });
  // }
}

module.exports = Control
