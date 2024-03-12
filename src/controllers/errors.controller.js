const ErrorModel = require("../model/error.model.js");

const createError = async (req, res) => {
    const { message, type, stack, timestamp } = req.body;
    try {
        await ErrorModel.create({
            message: message,
            type: type,
            stack: stack,
            timestamp: timestamp,
        });
        return res.status(201).json({ message: 'Error registered successfully.' });
    } catch (err) {
        res.status(500).json({ error: "@error/createError", message: 'Failed registering error.' });
    }
};

module.exports = {
    createError,
}