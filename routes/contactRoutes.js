const express = require("express");
const router = express.Router();
const { submitContact, saveLead } = require("../controllers/contactController");

router.post("/", submitContact);
router.post("/lead", saveLead);

module.exports = router;
