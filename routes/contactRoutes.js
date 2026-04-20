const express = require("express");
const { submitContact } = require("../controllers/contactController");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  submitContact
);

module.exports = router;
