const constant = require("../../constants/config");
const db = require("../../utilities/db");
const trxidRegex = new RegExp(/[0-9a-f]{64}/);
const axios = require('axios');  // To fetch from Hyperion

var controller = function() {};

async function fetchHyperionTransaction(trxId) {
    try {
        const response = await axios.get(`https://wax.eu.eosamsterdam.net/v2/history/get_transaction/${trxId}`);
        return response.data;
    } catch(error) {
        console.error("Error fetching from Hyperion:", error);
        return null;
    }
}


  //  function convertMementoToHyperion(mementoTrx) {
     //   let actionTrace = {
       //     signatures: [], 
          //  '@timestamp': mementoTrx.block_time || new Date().toISOString(), 
         //   act: {}, 
         //   block_num: mementoTrx.block_num,
         //   block_id: "", 
         //   global_sequence: 0, 
         //   producer: "",
         //   trx_id: mementoTrx.trx_id,
         //   account_ram_deltas: [], 
         //   console: "", 
         //   elapsed: 0, 
         //   context_free: false, 
         //   level: 0, 
         ///   except: null, 
         //   receipt: {},
         ////   creator_action_ordinal: 0, 
        //    action_ordinal: 0, 
         //   cpu_usage_us: 0, 
         //   net_usage_words: 0, 
         //   error_code: null, 
          //  max_inline: 0,
        //    inline_count: 0,
          //  inline_filtered: false, 
      //  };
    
      //  if (mementoTrx.trace) {
      //      actionTrace = { ...actionTrace, ...mementoTrx.trace };
      //  }
    
      //  return {
      //      seq: mementoTrx.seq,
     //       block_num: mementoTrx.block_num,
     //       block_time: mementoTrx.block_time,
     //       trx_id: mementoTrx.trx_id,
     //       trace: actionTrace
     //   };
 //   }

controller.get('/v2/history/get_transaction/:id', [
    check('id')
        .notEmpty()
        .withMessage('Transaction id must be provided.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const trxId = req.params.id.toLowerCase();
    const response = {
        query_time_ms: undefined,
        executed: false,
        cached: undefined,
        cache_expires_in: undefined,
        trx_id: req.params.id,
        lib: undefined,
        cached_lib: false,
        actions: undefined,
        generated: undefined,
        error: undefined
    };

    try {
        const [rows, fields] = await db.execute('SELECT * FROM transactions WHERE trx_id = ?', [trxId]);
        const hyperionTrx = await fetchHyperionTransaction(trxId);

        if (!hyperionTrx) {
            response.error = "Unable to fetch transaction from Hyperion.";
            return res.status(500).json(response);
        }

        if (rows.length > 0) {
            const mementoTrx = rows[0];
            const convertedTrx = convertMementoToHyperion(mementoTrx);
            
            response.seq = convertedTrx.seq;
            response.block_num = convertedTrx.block_num;
            response.block_time = convertedTrx.block_time;
            response.trx_id = convertedTrx.trx_id;
            response.trace = convertedTrx.trace;
            response.executed = true;
            res.status(200).json(response);
        } else {
            response.error = "Transaction not found in Memento.";
            res.status(404).json(response);
        }
    } catch (err) {
        console.error(err);
        response.error = 'An error occurred while retrieving transaction data.';
        res.status(500).json(response);
    }
});

module.exports = controller;
