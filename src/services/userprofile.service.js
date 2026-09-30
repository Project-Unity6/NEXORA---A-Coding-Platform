const userModel = require("../models/user.model")
const userStatsModel = require("../models/userstats.model")
const userActivityModel = require("../models/useractivity.model")
const {getDayDifference} = require("../utils/date.utils")


/* Helper Functions */
function getEmptyStats() {

    return {

        totalSubmissions: 0,

        acceptedSubmissions: 0,

        easySolved: 0,

        mediumSolved: 0,

        hardSolved: 0,

        solvedProblems: [],

        currentStreak: 0,

        longestStreak: 0
    };

}

function getEmptyActivity(year){

    return{

        year,

        activity:{}

    };

}

function calculateAcceptanceRate(stats){

    if(stats.totalSubmissions===0)
        return 0;

    return Number(
(
stats.acceptedSubmissions /
stats.totalSubmissions
*100
).toFixed(2)
);

}


function calculateActivitySummary(activity) {


    const dates = Object.keys(activity);

    if (dates.length === 0) {
        return {
            activeDays: 0,
            totalSubmissions: 0,
            longestStreak: 0
        };
    }

    dates.sort();

    const activeDays = dates.length;

    const totalSubmissions = Object.values(activity)
        .reduce((sum, count) => sum + count, 0);

    let currentStreak = 1;
    let longestStreak = 1;

    for (let i = 1; i < dates.length; i++) {

        const previous = new Date(dates[i - 1]);
        const current = new Date(dates[i]);

        const diff = getDayDifference(current, previous);

        if (diff === 1) {

            currentStreak++;

            longestStreak = Math.max(
                longestStreak,
                currentStreak
            );

        }
        else {

            currentStreak = 1;

        }

    }

    return {

        activeDays,

        totalSubmissions,

        longestStreak

    };

}

function buildProfileResponse({

    user,

    stats,

    activity,

    acceptanceRate,

    activitySummary

}){

    return{

        user:{

            id:user._id,

            username:user.username,

            email:user.email,

            role:user.role,

            joinedAt: user.createdAt

        },

        stats:{

            totalSolved:
                stats.solvedProblems?.length ?? 0,

            easySolved:
                stats.easySolved,

            mediumSolved:
                stats.mediumSolved,

            hardSolved:
                stats.hardSolved,

            totalSubmissions:
                stats.totalSubmissions,

            acceptedSubmissions:
                stats.acceptedSubmissions,

            acceptanceRate,

            currentStreak:
                stats.currentStreak,

            longestStreak:
                stats.longestStreak

        },

        activity:{

            year:activity.year,

            totalSubmissions:
                activitySummary.totalSubmissions,

            activeDays:
                activitySummary.activeDays,

            longestYearStreak:
                activitySummary.longestStreak,

            contributions:
                activity.activity

        }

    };

}


async function getUserProfile(userId,year){

const [user,stats,activity] = await Promise.all([

            userModel.findById(userId)
                .select("username email role createdAt").lean(),

            userStatsModel.findOne({ userId }).lean(),

            userActivityModel.findOne({
                userId,
                year
            }).lean()

        ]);
if(!user){
throw new Error("User not found");
}
const safeStats = stats ?? getEmptyStats();

const safeActivity = activity ?? getEmptyActivity(year);

const acceptanceRate = calculateAcceptanceRate(safeStats);

const activitySummary = calculateActivitySummary(safeActivity.activity);

return buildProfileResponse({

user,

stats:safeStats,

activity:safeActivity,

acceptanceRate,

activitySummary

});

}

module.exports = {getUserProfile}