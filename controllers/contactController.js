const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
  try {
    console.log(req.body);

    const contact = new Contact(req.body);

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact saved"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
};

module.exports = { submitContact };
