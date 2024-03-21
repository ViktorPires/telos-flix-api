const CommentModel = require("../model/comment.model");

const userHasCommentedOnMovie = async (userId, movieId) => {
  const existingComment = await CommentModel.findOne({ user_id: userId, movie_id: movieId });
  return !!existingComment;
};

module.exports = {
  userHasCommentedOnMovie,
};