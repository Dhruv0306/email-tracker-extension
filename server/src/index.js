import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import trackRoutes from "./routes/track.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/track", trackRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("📬 Email Tracker Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
