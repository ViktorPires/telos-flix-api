const CommentModel = require("../model/comment.model");
const MovieModel = require("../model/movie.model");
const { userHasRatedOnMovie, isValidRating } = require('../validators/comment.validations');

const { InvalidRatingException } = require("../exceptions/InvalidRatingException");
const { UserAlreadyRatedException } = require("../exceptions/UserAlreadyRatedException");

const list = async (request, response) => {
  try {
    const comments = await CommentModel.find()
      .populate('user_id', '-password')
      .populate('movie_id')

    if (!comments) {
      throw new Error();
    }

    return response.json(comments);
  } catch (err) {
    return response.status(400).json({
      error: '@comments/list',
      message: err.message || "Failed to list comments"
    });
  }
};

const listCommentsByMovie = async (request, response) => {
  try {
    const { movie_id } = request.params;

    const comments = await CommentModel.find({ movie_id: movie_id })
    .populate('user_id', 'name -_id');

    if (!comments) {
      throw new Error();
    }

    return response.json(comments);
  } catch (err) {
    return response.status(400).json({
      error: '@comments/listCommentsByMovie',
      message: err.message || `Failed to list comments from movie ${movie_id}`
    });
  }
};

const getById = async (request, response) => {
  const { id } = request.params;

  try {
    const comment = await CommentModel.findById(id)
    .populate('user_id', 'name -_id');

    if (!comment) {
      throw new Error();
    }

    return response.json(comment);
  } catch (err) {
    return response.status(400).json({
      error: "@comments/getById",
      message: err.message || `Comment not found ${id}`,
    });
  }
};

const create = async (request, response) => {
  try {
    const { movie_id } = request.params;
    const { content, rating } = request.body;
    const user_id = request.user._id;

    const parseRating = parseFloat(rating);

    if (!isValidRating(parseRating)) {
      throw new InvalidRatingException();
    }

    const movie = await MovieModel.findById(movie_id);
    if (!movie) {
      throw new Error();
    }

    const hasRatedBefore = await userHasRatedOnMovie(user_id, movie.id);
    if (hasRatedBefore) {
      throw new UserAlreadyRatedException();
    }

    let comment = await CommentModel.create({
      user_id,
      movie_id: movie.id,
      content: content?.trim(),
      rating: parseRating
    });

    comment = await comment.populate('user_id', 'name');

    return response.json(comment);
  } catch (err) {
    return response.status(400).json({
      error: '@comments/create',
      message: err.message || "Failed to create a comment"
    });
  }
};

const update = async (request, response) => {
  const { id } = request.params;
  const { content, rating } = request.body;
  const userId = request.user._id;
  const role = request.user.role;

  try {
    const comment = await CommentModel.findById(id);

    if (!comment) {
      throw new Error();
    }

    if (comment.user_id.toString() !== userId && role !== "admin") {
      return response.status(401).json({
        error: "@comments/update",
        message: 'You do not have permission to edit this comment',
      });
    }

    const parseRating = parseFloat(rating);

    if (Number.isNaN(parseRating) || !Number.isInteger(parseRating) || parseRating < 1 || parseRating > 5) {
      throw new InvalidRatingException();
    }

    const commentUpdated = await CommentModel.findByIdAndUpdate(
      id,
      {
        user_id: userId,
        movie_id: comment.movie_id,
        content,
        rating
      },
      {
        new: true,
      }
    );

    return response.json(commentUpdated);
  } catch (error) {
    return response.status(400).json({
      error: "@comments/update",
      message: error || `Comment not found ${id}`,
    });
  }
};

const remove = async (request, response) => {
  const { id } = request.params;

  try {
    const commentRemoved = await CommentModel.findByIdAndDelete(id);

    if (!commentRemoved) {
      throw new Error();
    }

    return response.status(204).send();
  } catch (err) {
    return response.status(400).json({
      error: "@comments/remove",
      message: err.message || `Comment not found ${id}`,

    });
  }
};

module.exports = {
  list,
  listCommentsByMovie,
  getById,
  create,
  update,
  remove,
};