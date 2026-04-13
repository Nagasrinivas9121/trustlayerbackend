const express = require("express");

const router = express.Router();

const ServiceRequest = require("../models/ServiceRequest");


/*
 CLIENT SUBMITS SERVICE REQUEST
 Public route (no login required)
*/

router.post("/", async (req,res)=>{

try{

const { service, email, message } = req.body;

if(!service || !email || !message){

return res.status(400).json({

message:"Missing required fields"

});

}

const request = await ServiceRequest.create({

service,

requesterEmail:email,

description:message

});

return res.status(201).json({

success:true,

request

});

}catch(err){

console.error("SERVICE REQUEST ERROR:",err);

return res.status(500).json({

message:"Server error"

});

}

});


module.exports = router;