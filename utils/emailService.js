const nodemailer = require("nodemailer");

const sendEmail = async (subject, htmlBody) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Assuming gmail, user can change if needed or provide SMTP host
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending the lead notification to the company email
      subject: subject,
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error to prevent request from failing if just email fails, 
    // or maybe throw it based on preference. Let's log it for now.
  }
};

module.exports = sendEmail;
