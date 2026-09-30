const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    activity: {
        type: Map,
        of: Number,
        default: {}
    }

}, {
    timestamps: true
});

userActivitySchema.index(
    {
        userId: 1,
        year: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("userActivity",userActivitySchema);