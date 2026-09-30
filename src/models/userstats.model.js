const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    totalSubmissions:{
        type:Number,
        default:0
    },

    acceptedSubmissions:{
        type:Number,
        default:0
    },

    solvedProblems:[{

        problemId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Problem",
            required:true
        },

        firstSolvedAt:{
            type:Date,
            default:Date.now
        }

    }],

    easySolved:{
        type:Number,
        default:0
    },

    mediumSolved:{
        type:Number,
        default:0
    },

    hardSolved:{
        type:Number,
        default:0
    },

    currentStreak:{
        type:Number,
        default:0
    },

    longestStreak:{
        type:Number,
        default:0
    },

    lastActiveDate:{
        type:Date,
        default:null
    }

},{
    timestamps:true
});

userStatsSchema.index(
    {
        userId:1
    },
    {
        unique:true
    }
);

const userStatsModel = mongoose.model("userStats",userStatsSchema);

module.exports = userStatsModel;