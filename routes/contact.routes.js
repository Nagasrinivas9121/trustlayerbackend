const express = require("express");

const Contact = require("../models/Contact");

const router = express.Router();


/* CREATE CONTACT LEAD */

router.post("/", async (req,res)=>{

try{

const { name, email, company, service, message } = req.body;

if(!email || !message){

return res.status(400).json({

message:"Email and message required"

});

}

const contact = await Contact.create({

name,

email,

company,

service,

message

});

return res.status(201).json({

message:"Contact stored",

contact

});

}catch(err){

console.error("CONTACT ERROR:",err);

return res.status(500).json({

message:"Server error"

});

}

});


module.exports = router;