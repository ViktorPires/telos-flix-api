const MovieModel = require("../model/movie.model");

const list = async (request, response) => {
  const { title, genres, limit, page } = request.query
  try {

    if (title || genres) {
      const formattedTitle = RegExp(title);
      const formattedGenres = genres ? genres.split(" ") : [''];

      const filteredMovies = await MovieModel
        .find(title ? { title: { $regex: formattedTitle, $options: "i" } } : { genres: { $all: formattedGenres } })
        .limit(limit || 10)
        .skip((page - 1) * (limit || 10))
        .select(request.user ? "" : "-video");

      return response.json(filteredMovies);
    }

    const unfilteredMovies = await MovieModel
      .find()
      .limit(limit || 10)
      .skip((page - 1) * (limit || 10))
      .select(request.user ? "" : "-video");

    return response.json(unfilteredMovies);
  } catch (err) {
    return response.status(400).json({
      error: "@movies/list",
      message: err.message || "Failed to list movies",
    });
  }
};

const listFreeMovies = async (request, response) => {
  const { limit, page } = request.query
  try {
    const freeMovies = await MovieModel
      .find({ isFree: true })
      .limit(limit || 10)
      .skip((page - 1) * (limit || 10));

      if (!freeMovies) {
        throw new Error("No free movies found");
      }

      return response.json(freeMovies);
    } catch (err) {
      return response.status(400).json({
        error: "@movies/listFreeMovies",
        message: err.message || "Failed to list free movies",
    });
  }
};
const getById = async (request, response) => {
  const { id } = request.params;

  try {
    let movie;

    if (!request.user) {
      movie = await MovieModel.findById(id).select("-video");
    } else {
      movie = await MovieModel.findById(id);
    }

    if (!movie) {
      throw new Error();
    }

    return response.json(movie);

  } catch (err) {
    return response.status(400).json({
      error: "@movies/getById",
      message: err.message || `Movie not found ${id}`,
    });
  }
};

const listGenres = async (request, response) => {
  try {
    const genres = await MovieModel.distinct('genres');
    const sortedGenres = genres.sort();

    return response.json(sortedGenres);
  } catch (err) {
    return response.status(400).json({
      error: "@movies/listGenres",
      message: err.message || "Failed to list genres",
    });
  }
};

const create = async (request, response) => {
  const { title, description, year, genres, image, video } = request.body;

  try {
    const movie = await MovieModel.create({
      title,
      description,
      year,
      genres,
      image,
      video,
    });

    return response.status(201).json(movie);
  } catch (err) {
    return response.status(400).json({
      error: "@movies/create",
      message: err.message || "Failed to create a movie",
    });
  }
};

const update = async (request, response) => {
  const { id } = request.params;
  const { title, description, year, genres, image, video } = request.body;

  try {
    const movieUpdated = await MovieModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        year,
        genres,
        image,
        video,
      },
      {
        new: true,
      }
    );

    return response.json(movieUpdated);
  } catch (error) {
    return response.status(400).json({
      error: "@movies/update",
      message: `Movie not found ${id}`,
    });
  }
};

const remove = async (request, response) => {
  const { id } = request.params;

  try {
    const movieRemoved = await MovieModel.findByIdAndDelete(id);

    if (!movieRemoved) {
      throw new Error();
    }

    return response.status(204).send();
  } catch (err) {
    return response.status(400).json({
      error: "@movies/remove",
      message: err.message || `Movie not found ${id}`,
    });
  }
};

module.exports = {
  list,
  listFreeMovies,
  getById,
  listGenres,
  create,
  update,
  remove,
};
