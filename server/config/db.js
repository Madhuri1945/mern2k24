const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const { MONGODB_URI, NODE_ENV } = process.env;

// Set up Mongoose connection
mongoose.connect(MONGODB_URI, {
  dbName: "RetrocraftHub",
});

const db = mongoose.connection;

// Event listeners for Mongoose connection
db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

process.on("SIGINT", () => {
  db.close(() => {
    console.log("MongoDB connection closed due to process termination");
    process.exit(0);
  });
});

module.exports = db;
