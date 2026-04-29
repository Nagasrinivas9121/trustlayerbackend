const express = require("express");
const router = express.Router();
const { runScan } = require("../controllers/scanController");

router.post("/", runScan);

module.exports = router;
