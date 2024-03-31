const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const watchListSchema = new Schema({
  watchList: {
    type: String,
    required: true,
    unique: true,
  },
});

const watchList = mongoose.model("watchList", watchListSchema);

module.exports = watchList;
