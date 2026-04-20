const express = require("express");
const { submitQuote } = require("../controllers/quoteController");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("service").notEmpty().withMessage("Service is required"),
  ],
  submitQuote
);

module.exports = router;
