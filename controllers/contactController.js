const Lead = require("../models/Lead");
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Save lead from scanner
// @route   POST /api/contact/lead
// @access  Public
const saveLead = async (req, res) => {
  try {
    const { name, email, company, domain, scanOptions, score, issues } = req.body;

    if (!name || !email || !company) {
      return res.status(400).json({ message: "Please provide name, email and company" });
    }

    const lead = await Lead.create({
      name,
      email,
      company,
      domain,
      scanOptions,
      score,
      issues,
    });

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to admin
        subject: `New VAPT Lead: ${company}`,
        text: `
New lead from TrustLayer Labs Scanner!

Name: ${name}
Email: ${email}
Company: ${company}
Domain Scanned: ${domain}
Score: ${score}
High Issues: ${issues?.high || 0}
        `,
      });
    } catch (emailError) {
      console.error("Email failed to send:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Lead captured successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    General contact form submission
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, company, website, service, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      company,
      website,
      service,
      message,
    });

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to admin
        subject: `New Contact Form Submission: ${name}`,
        text: `
New message from TrustLayer Labs Contact Form!

Name: ${name}
Email: ${email}
Company: ${company}
Service: ${service}
Message: ${message}
        `,
      });
    } catch (emailError) {
      console.error("Email failed to send:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  saveLead,
  submitContact,
};
