const CommentModel = require("../model/comment.model");

const userHasRatedOnMovie = async (userId, movieId) => {
  const existingComment = await CommentModel.findOne({ user_id: userId, movie_id: movieId });
  return !!existingComment;
};

const isValidRating = (rating) => {
  const validRating  = Number.isNaN(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5
  return !validRating
}

module.exports = {
  userHasRatedOnMovie,
  isValidRating,
};