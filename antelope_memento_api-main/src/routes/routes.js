const express = require("express");
const router = express.Router();
const healthRoute = require("../modules/health/route");
const historyRoute = require("../modules/history/route");
const transactionRoute = require("../modules/transactionStatus/route");
const graphqlRoute = require("../modules/graphql/route");
const actionRoute = require("../modules/getActions/route");
const transactionRoute = require("../modules/gettransaction/route");
const healthv2Route = require("../modules/geV2health/route");

router.use("/", healthRoute);
router.use("/", historyRoute);
router.use("/", transactionRoute);
router.use("/", graphqlRoute);
router.use("/", actionRoute);
router.use("/", transactionRoute);
router.use("/", healthv2Route);


module.exports = router;
