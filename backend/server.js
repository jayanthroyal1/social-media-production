const express = require("express");

const app = express();

require("dotenv").config();

app.get("/health", (req, res, next) => {
  res.json({ status: "Backend running inside Docker" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
