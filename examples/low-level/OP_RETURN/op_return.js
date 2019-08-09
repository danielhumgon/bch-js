/*
  Check the outputs of a given transaction for messages in OP_Return
*/

const BCHJS = require("../../../src/bch-js")
const bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:12400/v3/` })

// Choose a transaction to parse for OP_Return

const txid = `5b81b332c8fa5a2b2e77bb928bd18072af4485f02a7325d346f1f28cf3d4a6bb`

function parseOP_RETURN(txid) {
  console.log(`Parsing transaction ${txid} for messages in OP_RETURN...`)
  console.log(``)

  // Get transaction details from txid
  bchjs.Insight.Transaction.details(txid).then(
    tx => {
      // You may wish to log this tx info to the console to inspect and plan your parsing function
      // console.log(tx)

      // Begin parsing transaction

      // Initialize an array to store any OP_Return messages
      let messages = []

      // Iterate over outputs looking for OP_Return outputs

      for (let i = 0; i < tx.vout.length; i++) {
        // If this is an OP_Return output
        if (typeof tx.vout[i].scriptPubKey.addresses === "undefined") {
          let message = ""

          // Decode the OP_Return message
          message = tx.vout[i].scriptPubKey.asm

          let fromAsm = bchjs.Script.fromASM(message)
          let decoded = bchjs.Script.decode(fromAsm)
          message = decoded[1].toString("ascii")

          // Add this decoded OP_Return message to an array, in case multiple outputs have OP_Return messages
          messages.push(message)
        }
      }

      if (messages.length === 1) {
        console.log(`Message found!`)
        console.log(``)
        console.log(`Message: ${messages[0]}`)
      } else {
        console.log(`${messages.length} messages found!`)
        console.log(``)
        for (let j=0; j < messages.length; j++) {
          console.log(`Message ${j+1} of ${messages.length+1}: ${messages[j]}`)
        }
      }
    },
    err => {
      console.log("Error in bchjs.Insight.Transaction.details(${txid}):")
      console.log(err)
    }
  )
}

parseOP_RETURN(txid)
