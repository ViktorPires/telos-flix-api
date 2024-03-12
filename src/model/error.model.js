const mongoose = require("mongoose");

const errorSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        stack: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("errors", errorSchema);