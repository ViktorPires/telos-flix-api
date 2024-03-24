const { compareHash } = require('../utils/hashProvider');
const UserModel = require("../model/user.model");

const list = async (request, response) => {
  try {
    const users = await UserModel.find({}, { password: 0 });

    return response.json(users);
  } catch (err) {
    return response.status(400).json({
      error: "users/list",
      message: "Failed to list users",
    });
  }
};

const getById = async (request, response) => {
  const { id } = request.params;

  try {
    const user = await UserModel.findById(id, { password: 0 });

    if (!user) {
      throw new Error();
    }

    return response.json(user);
  } catch (err) {
    return response.status(400).json({
      error: "@users/getById",
      message: err.message || `User not found ${id}`,
    });
  }
};

const create = async (request, response) => {
  const { name, email, password, cellphone } = request.body;

  try {
    const user = await UserModel.create({
      name,
      email,
      password,
      cellphone,
      role: "customer"
    });

    return response.status(201).json(user);
  } catch (err) {
    return response.status(400).json({
      error: "@users/create",
      message: err.message || "Failed to create user",
    });
  }
};

const createAdminUsers = async (request, response) => {
  const { name, email, password, cellphone } = request.body;

  try {
    const newUser = await UserModel.create({
      name,
      email,
      password,
      cellphone,
      role: 'admin'
    });

    return response.json(newUser)
  } catch (err) {
    return response.status(400).json({
      error: "@users/create",
      message: err.message || "Failed to create user",
    });
  }
};

const update = async (request, response) => {
  const { id } = request.params;
  const { name, email, password, cellphone } = request.body;
  const userId = request.user._id;
  const role = request.user.role;

  try {

    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error();
    }

    if (user._id.toString() !== userId && role !== "admin") {
      return response.status(401).json({
        error: "@users/update",
        message: 'You do not have permission to update this user',
      });
    }

    const updatedFields = {
      name,
      email,
      cellphone,
      password
    };

    if (password) {
      const isSamePassword = await compareHash(password, user.password);

      if (!isSamePassword) {
        updatedFields.password = password;
      }
    }

    const userUpdated = await UserModel.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true
      }
    );

    return response.json(userUpdated);
  } catch (err) {
    return response.status(400).json({
      error: "@users/update",
      message: err.message || `User not found ${id}`,
    });
  }
};

const remove = async (request, response) => {
  const { id } = request.params;
  const userId = request.user._id;
  const role = request.user.role;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error();
    }

    if (user._id.toString() !== userId && role !== "admin") {
      return response.status(401).json({
        error: "@users/remove",
        message: 'You do not have permission to delete this user',
      });
    }

    await UserModel.findByIdAndDelete(id);

    return response.status(204).send();
  } catch (err) {
    return response.status(400).json({
      error: "@users/remove",
      message: err.message || `User not found ${id}`,
    });
  }
};

module.exports = {
  list,
  getById,
  create,
  createAdminUsers,
  update,
  remove,
};
