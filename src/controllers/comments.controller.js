const CommentModel = require("../model/comment.model");
const MovieModel = require("../model/movie.model");

const { InvalidRatingException } = require("../exceptions/InvalidRatingException");

const list = async (request, response) => {
    try {
        const comments = await CommentModel.find()
        .populate('user_id')
        .populate('movie_id');
  
      if(!comments) {
          throw new Error();
      }
  
      return response.json(comments);
    } catch (err) {
      return response.status(400).json({ 
          error: '@comments/list', 
          message: err.message || "Failed to list comments" });
    }
  };

const listCommentsByMovie = async (request, response) => {
  try {
    const { movie_id } = request.params;

    const comments = await CommentModel.find({ movie_id: movie_id }).populate('user_id');

    if(!comments) {
        throw new Error();
    }

    return response.json(comments);
  } catch (err) {
    return response.status(400).json({ 
        error: '@comments/listCommentsByMovie', 
        message: err.message || `Failed to list comments from movie ${movie_id}` });
  }
};

const getById = async (request, response) => {
  const { id } = request.params;

try{
    const comment = await CommentModel.findById(id);

    if(!comment) {
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

      // Validating rating value
      if (Number.isNaN(parseRating) || !Number.isInteger(parseRating) || parseRating < 1 || parseRating > 5) {
        throw new InvalidRatingException();
      }

      const movie = await MovieModel.findById(movie_id);

      if(!movie) {
        throw new Error();
      }
  
      const comment = await CommentModel.create({ 
          user_id, 
          movie_id: movie.id, 
          content, 
          rating: parseRating
      });
  
      return response.json(comment);
    } catch (err) {
      return response.status(400).json({ 
          error: '@comments/create', 
          message: err.message || "Failed to create a comment" });
    }
};
  

const update = async (request, response) => {
  const { id } = request.params;
  const { content, rating} = request.body;
  const userId = request.user._id;
  const role = request.user.role;

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

  try {
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
      message: `Comment not found ${id}`,
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