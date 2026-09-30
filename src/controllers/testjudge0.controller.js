/* DUMMY FILE FOR CHECKING JUDGE0 WORKING */


const {submitBatch,getBatchResults} = require("../services/judge0service");


const testJudgeController = async (req, res) => {

    const submissions = [
        {
            source_code: `
                #include<iostream>
                using namespace std;

                int main() {
                    cout<<"hello sid";
                    return 0;
                }
            `,
            language_id: 54, 
            stdin: ""
        }
    ];

    // Step 1: Submit
    const submissionResponse =
        await submitBatch(submissions);

    // Step 2: Extract tokens
    const tokens =
        submissionResponse.map(
            submission => submission.token
        );

    // Step 3: Wait briefly
    await new Promise(resolve =>
        setTimeout(resolve, 2000)
    );

    // Step 4: Fetch results
    const result =
        await getBatchResults(tokens);

    return res.status(200).json({
        success: true,
        data: result
    });
};

module.exports = testJudgeController;