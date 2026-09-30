const userStatsModel = require("../models/userstats.model")
const userActivityModel = require("../models/useractivity.model")


//helper functions
const {normalizeDate,getDayDifference} = require("../utils/date.utils")

/**
 * Updates solved problems and difficulty counters.
 * Only increments on the user's first accepted solution.
 */

async function ensureUserStats(userId) {
    return await userStatsModel.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId } },
        {
            returnDocument: "after",
            upsert: true,
            setDefaultsOnInsert: true
        }
    );
}

function updateSubmissionCounters(userStats,status) {
    userStats.totalSubmissions++;
    if(status==="Accepted")
        userStats.acceptedSubmissions++;
}

function updateSolvedProblems(userStats, problem) {

    const alreadySolved =
        userStats.solvedProblems.some(solved => solved.problemId.equals(problem._id));

    if (alreadySolved) {
        return;
    }

    userStats.solvedProblems.push({problemId: problem._id,firstSolvedAt: new Date()});

    switch (problem.difficulty) {

        case "easy":
            userStats.easySolved++;
            break;

        case "medium":
            userStats.mediumSolved++;
            break;

        case "hard":
            userStats.hardSolved++;
            break;
    }

}

async function updateUserActivity(userId) {

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const year = now.getUTCFullYear();

    await userActivityModel.findOneAndUpdate(
        {
            userId,
            year
        },

        {
            $inc: {
                [`activity.${today}`]: 1
            }
        },

        {
            upsert: true,

            setDefaultsOnInsert: true
        }

    );

}

function updateStreak(userStats) {

    const today = normalizeDate(new Date());

    if (!userStats.lastActiveDate) {

        userStats.currentStreak = 1;
        userStats.longestStreak = 1;
        userStats.lastActiveDate = today;

        return;
    }

    const diff = getDayDifference(today, userStats.lastActiveDate);

    if (diff === 0) {
        return;
    }

    if (diff === 1) {

        userStats.currentStreak++;

        userStats.longestStreak = Math.max(
            userStats.longestStreak,
            userStats.currentStreak
        );
    } else {

        userStats.currentStreak = 1;
    }

    userStats.lastActiveDate = today;
}



async function updateUserAnalytics({submission,problem}){

const userStats = await ensureUserStats(submission.userId);

updateSubmissionCounters(userStats,submission.status);

if(submission.status==="Accepted"){
updateSolvedProblems(userStats,problem);
}

updateStreak(userStats);

await userStats.save();

try {
    await updateUserActivity(submission.userId);
} catch (err) {
    console.error("Failed to update user activity:", err);
}

}


module.exports = updateUserAnalytics