const Quote = require("../models/Quote");
const sendEmail = require("../utils/emailService");
const { validationResult } = require("express-validator");

// @desc    Submit a quote request
// @route   POST /api/quote
// @access  Public
const submitQuote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, company, website, service, message, budget } = req.body;

    const quote = await Quote.create({
      name,
      email,
      company,
      website,
      service,
      message,
      budget,
    });

    const emailSubject = `New Lead from TrustLayer Labs Website (Quote for ${service})`;
    const emailBody = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Website:</strong> ${website}</p>
      <p><strong>Service Requested:</strong> ${service}</p>
      <p><strong>Estimated Budget:</strong> ${budget || "N/A"}</p>
      <p><strong>Message:</strong> ${message || "N/A"}</p>
    `;

    await sendEmail(emailSubject, emailBody);

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitQuote,
};
