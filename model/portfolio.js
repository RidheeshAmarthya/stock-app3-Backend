const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalcost: {
    type: Number,
    required: true,
  },
});

const portfolio = mongoose.model("portfolio", portfolioSchema);

module.exports = portfolio;
