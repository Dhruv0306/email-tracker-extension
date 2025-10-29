import mongoose from "mongoose";

const EmailOpenSchema = new mongoose.Schema({
  emailId: { type: String, required: true },       // unique ID of the sent email
  recipient: { type: String, required: true },     // recipient email address
  openedAt: { type: Date, default: Date.now },     // timestamp
  ip: { type: String },                            // IP address of the opener
  userAgent: { type: String },                     // User agent string
  clientInfo: { type: mongoose.Schema.Types.Mixed } // optional JSON for extra info
});

const EmailOpen = mongoose.model("EmailOpen", EmailOpenSchema);

export default EmailOpen;