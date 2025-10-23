import express from "express";
import EmailOpen from "../models/EmailEvent.js";

const router = express.Router();

router.get("/:emailId/:recipient", async (req, res) => {
  const { emailId, recipient } = req.params;

  try {
    await EmailOpen.create({
      emailId,
      recipient,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      clientInfo: { headers: req.headers },
    });

    // Emit a WebSocket notification
    const io = req.app.get("io");
    io.emit("emailOpened", {
      emailId,
      recipient,
      timestamp: new Date(),
    });

    // Send 1x1 transparent pixel
    res.set("Content-Type", "image/png");
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
      "base64"
    );
    res.send(pixel);
  } catch (err) {
    console.error("Error logging email open:", err);
    res.status(500).send("Error");
  }
});

export default router;
