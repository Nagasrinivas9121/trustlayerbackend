import express from "express";

import Contact from "../models/Contact.js";

const router = express.Router();


router.post("/", async (req, res) => {

 try {

   const contact = new Contact(req.body);

   await contact.save();

   res.json({ success: true });

 }

 catch {

   res.status(500).json({ error: true });

 }

});

export default router;