const express = require("express");
const router = express.Router();
const { getAllEntries, createEntry } = require("../controllers/historyController");

// get all history entries
router.get("/", getAllEntries);

// create a new history entry
router.post("/", createEntry);

module.exports = router;
