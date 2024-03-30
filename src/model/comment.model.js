const mongoose = require("mongoose");
const MovieModel = require("./movie.model");

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
      required: true,
    },
    content: {
      type: String,
      maxlength: 200,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true
  }
);

commentSchema.pre('save', async function(next) {
  const comment = this;
  const movie = await MovieModel.findById(comment.movie_id);

  if (movie) {
    movie.totalRating = movie.totalRating + comment.rating;
    movie.numComments = movie.numComments + 1;
    await movie.save();
  }

  next();
});

commentSchema.post('remove', async function(comment) {
  const movie = await MovieModel.findById(comment.movie_id);

  if (movie) {
    movie.totalRating = movie.totalRating - comment.rating;
    movie.numComments = movie.numComments - 1;
    await movie.save();
  }
});

module.exports = mongoose.model("comments", commentSchema);
