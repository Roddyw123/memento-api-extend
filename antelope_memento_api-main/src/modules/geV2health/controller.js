const constant = require("../../constants/config");
const db = require("../../utilities/db");

var controller = function() {};

async function checkHealth() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    return createHealth('MariaDB', 'OK');

  } catch (e) {
    console.log(e);
    return createHealth('MariaDB', 'Error');
  } finally {
    if (connection) connection.release();
  }
}

function createHealth(name, status, data) {
  let time = Date.now();
  return {
    service: name,
    status: status,
    service_data: data,
    time: time
  };
}

async function getHealthQuery() {
  let response = {
    version: '',
    host: 'memento.eu.eosamsterdam.net',
    health: []
  };
  response.health = await Promise.all([
    checkHealth()
  ]);
  return response;
}

router.get('/', async function (req, res) {
    const healthCheck = await getHealthQuery();
    
    let hasError = false;
    for (let health of healthCheck.health) {
      if (health.status === 'Error') {
        hasError = true;
        break;
      }
    }
    
    if (hasError) {
      res.status(500).send(healthCheck);
    } else {
      res.status(200).send(healthCheck);
    }
  });

module.exports = router;
