const Contact = require("../models/Contact");
const sendEmail = require("../utils/emailService");
const { validationResult } = require("express-validator");

// @desc    Submit a contact lead
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, company, website, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      company,
      website,
      message,
    });

    const emailSubject = "New Lead from TrustLayer Labs Website (Contact)";
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "N/A"}</p>
      <p><strong>Website:</strong> ${website || "N/A"}</p>
      <p><strong>Message:</strong> ${message}</p>
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
  submitContact,
};
