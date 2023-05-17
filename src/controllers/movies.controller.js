const MovieModel = require("../model/movie.model");

const list = async (request, response) => {
  const { page } = request.params
  const { title, genres } = request.query
  const formattedTitle = RegExp(title)
  const formattedGenres = genres.split(" ")

  try {
    const movies = await MovieModel.find(title ? { title: { $regex: formattedTitle } } : { genres: { $all: formattedGenres } }).limit(10).skip((page - 1) * 10)

    return response.json(movies);
  } catch (err) {
    return response.status(400).json({
      error: "@movies/list",
      message: err.message || "Failed to list movies",
    });
  }
};

const getById = async (request, response) => {
  const { id } = request.params;
  const { authorization } = request.headers;

  try {
    let movie;

    if (authorization) {
      const [prefix, token] = authorization.split(" ");

      if (prefix === "Bearer" && token) {
        // Validating JWT
        jwtService.verify(token, JWT_SECRET, async (err) => {
          if (err) {
            movie = await MovieModel.findById(id).select("-video");

            if (!movie) {
              throw new Error();
            }

            console.log("Invalid Token: ", err.message);

            return response.json(movie);
          }

          movie = await MovieModel.findById(id);

          if (!movie) {
            throw new Error();
          }

          return response.json(movie);
        });
      } else {
        movie = await MovieModel.findById(id).select("-video");

        if (!movie) {
          throw new Error();
        }

        return response.json(movie);
      }
    } else {
      movie = await MovieModel.findById(id).select("-video");

      if (!movie) {
        throw new Error();
      }

      return response.json(movie);
    }
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
  getById,
  listGenres,
  create,
  update,
  remove,
};
