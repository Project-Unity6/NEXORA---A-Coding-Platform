const axios = require("axios");

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;

//submit a batch of code submissions to Judge0 API
const submitBatch = async (submissions) => {

    const response = await axios.post(
        `${JUDGE0_API_URL}/submissions/batch`,
        {
            submissions
        },
        {
            params: {
                base64_encoded: true,
                wait: false
            }
        }
    );

    return response.data;
};


//result of the batch submission will be an array of tokens corresponding to each submission in the same order.
const getBatchResults = async (tokens) => {

    const response = await axios.get(
        `${JUDGE0_API_URL}/submissions/batch`,
        {
            params: {
                tokens: tokens.join(","),
                base64_encoded: true,
                 fields:"stdout,stderr,compile_output,message,time,memory,status,token"
            }
        }
    );

    return response.data.submissions;
};


module.exports = {
    submitBatch,
    getBatchResults
};

