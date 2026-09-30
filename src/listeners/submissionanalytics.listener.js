const submissionCompletedEvent = require("../events/submissioncompleted.event");
const updateUserAnalytics = require("../services/useranalytics.service")



submissionCompletedEvent.on( "submissionCompleted", async ({ submission, problem }) => {

        // console.log("Updating User Stats and Activity...");
        try{
               await updateUserAnalytics({submission,problem});
        }
        catch(err){
              console.error(
    "[SubmissionAnalytics]",
    {
        submissionId: submission._id,
        userId: submission.userId,
        error: err.message
    });
        }

    });