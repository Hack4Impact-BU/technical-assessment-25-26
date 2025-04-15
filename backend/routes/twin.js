import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "🌍 Twin location route is working!" });
});

export default router;