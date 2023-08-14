const express = require("express");
const constroller = require("./controller");

const router = express.Router();

router.get("/getTransaction", constroller.getTransaction);

module.exports = router;