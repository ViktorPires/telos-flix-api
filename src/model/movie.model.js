const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    genres: {
      type: Array,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    isFree: {
      type: Boolean,
      required: false,
      default: false,
    },
    totalRating: { 
      type: Number, 
      default: 0 
    },
    numComments: { 
      type: Number, 
      default: 0 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("movies", MovieSchema);
