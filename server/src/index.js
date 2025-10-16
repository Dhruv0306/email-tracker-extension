import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("📬 Email Tracker Server is running!");
});

// Example route: pixel tracker
app.get("/track/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Email opened: ${id}`);
  // TODO: Save to DB and trigger notification
  res.set("Content-Type", "image/png");
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
    "base64"
  );
  res.send(pixel);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
