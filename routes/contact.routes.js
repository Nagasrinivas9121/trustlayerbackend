const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const { name, email, company, service, message } = req.body;

    if (!email || !message) {

      return res.status(400).json({
        message: "Email and message required"
      });

    }

    console.log({
      name,
      email,
      company,
      service,
      message
    });

    return res.status(200).json({
      message: "Request received"
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: "Server error"
    });

  }
});

module.exports = router;