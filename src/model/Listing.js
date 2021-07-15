const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = new Schema({
  title: String,
  datePosted: Date,
  neighborhood: String,
  url: String,
  jobDescription: String,
  jobCompensation: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
