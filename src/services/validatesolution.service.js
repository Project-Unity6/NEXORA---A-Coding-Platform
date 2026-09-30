const getlanguageId = require("../utils/problemUtils").JUDGE0_LANGUAGE_IDS
const {submitBatch,getBatchResults} = require("./judge0service");
const judge0Status = require("../utils/problemUtils").JUDGE0_STATUS

function decodeResults(results)
{
    return results.map((result)=>({
            
            ...result,

            stdout: typeof result.stdout==="string" ? 
            Buffer.from(result.stdout,"base64").toString("utf-8") : null ,

            stderr: typeof result.stderr==="string" ?
            Buffer.from(result.stderr,"base64").toString("utf-8") : null ,

            compile_output: typeof result.compile_output==="string" ?
            Buffer.from(result.compile_output,"base64").toString("utf-8") : null ,

            message:typeof result.message === "string"? 
            Buffer.from(result.message,"base64").toString("utf-8") : null 

  }))
}


async function validateReferenceSolution(problemData) {
    
    const {visibleTestCases,hiddenTestCases,referenceSolution,boilerPlate} = problemData;
          //combine all the testcases
          const allTestCases = [...visibleTestCases , ...hiddenTestCases ]
         
          //we need to have driverCode for all the languages 
          const boilerPlateMap = {};
          for(let {language,driverCode} of boilerPlate){
                  boilerPlateMap[getlanguageId[language]] = driverCode;
          }
         
          for(let {language,completeCode} of referenceSolution ){
                  const languageId = getlanguageId[language]
                  const driverCode = boilerPlateMap[languageId]
                  
                  //check whether driver code for this language is present or not 
                  if(!driverCode){
                  throw new Error(`Driver code missing for ${language}`);
                }
    
                if(!driverCode.includes("{{USER_CODE}}")){
                throw new Error(`USER_CODE placeholder missing in ${language} driver code`);
              }
    
                  //creating complete solution code 
                  const sourceCode =
                  driverCode.replace(
                  "{{USER_CODE}}",
                  completeCode
                  );
    
                  //create batch (include solution of all languages and send them together) submission for this problem 
                  const submissions = allTestCases.map((obj)=>({
                  
                    language_id: languageId,

   source_code:
   Buffer.from(
      sourceCode
   ).toString(
      "base64"
   ),

   stdin:
   Buffer.from(
      obj.input
   ).toString(
      "base64"
   ),

   expected_output:
   Buffer.from(
      obj.output
   ).toString(
      "base64"
   ),

                 cpu_time_limit:1,
                 memory_limit:256000
        
                  }))
    
                  // Step 1: Submit
                  const submissionResponse = await submitBatch(submissions) 
    
                  // Step 2: Extract tokens
                  const tokens =submissionResponse.map(submission => submission.token);
                  // console.log(tokens);//debugger
    
                  // Step 3: Wait briefly
                  let results;
                  let attempts = 0;
                  const MAX_ATTEMPTS = 10;
    
                while(attempts < MAX_ATTEMPTS)
                 {           
               results = await getBatchResults(tokens);
    
               const isFinished =results.every(result =>result.status.id !== 1 &&result.status.id!== 2)
    
               if(isFinished)
               break;
               attempts++;
    
               await new Promise((res)=>{
               setTimeout(()=>{
               res("")
               },1000)
            });
          }
                if(!results){
                throw new Error("Failed to fetch Judge0 results");
              }

                            results = results.map(
   (result)=>({

      ...result,

      stdout:
      typeof result.stdout === "string"
      ? Buffer
         .from(
            result.stdout,
            "base64"
         )
         .toString("utf-8")
      : null,

      stderr:
      typeof result.stderr === "string"
      ? Buffer
         .from(
            result.stderr,
            "base64"
         )
         .toString("utf-8")
      : null,

      compile_output:
      typeof result.compile_output === "string"
      ? Buffer
         .from(
            result.compile_output,
            "base64"
         )
         .toString("utf-8")
      : null,

      message:
      typeof result.message === "string"
      ? Buffer
         .from(
            result.message,
            "base64"
         )
         .toString("utf-8")
      : null
   })
);
                const allFinished =results.every(result =>result.status.id !== 1 &&result.status.id!== 2);
    
                  if(!allFinished){
                  throw new Error("Judge0 validation timeout");
                }
                  // Step 4: check results
                  const hasFailed = results.some(result =>result.status.id !== 3);
                  
    // debugging lines
    // console.log(
    //    JSON.stringify(
    //       results,
    //       null,
    //       2
    //    )
    // );   
                  if(hasFailed){
                    throw new Error(`Reference solution validation failed for ${language}`);
                  }
                  // console.log(results)
          }
    return true;
}




async function validateUserSolution(problemData) {
      const {visibleTestCases,hiddenTestCases,sourceCode,boilerPlate,language} = problemData;
          //combine all the testcases
          const allTestCases = [...visibleTestCases , ...hiddenTestCases ]
        
          //we need to have driverCode forthe given languages 
          const boilerPlateMap = {};
          for(let {language,driverCode} of boilerPlate){
                  boilerPlateMap[getlanguageId[language]] = driverCode;
          }
         
                  const languageId = getlanguageId[language]
                  const driverCode = boilerPlateMap[languageId]
                  
                  //check whether driver code for this language is present or not 
                  if(!driverCode){
                  throw new Error(`Driver code missing for ${language}`);
                }
    
                if(!driverCode.includes("{{USER_CODE}}")){
                throw new Error(`USER_CODE placeholder missing in ${language} driver code`);
              }
    
                  //creating complete solution code 
                  const fullCode =
                  driverCode.replace(
                  "{{USER_CODE}}",
                  sourceCode
                  );
    
                  //create batch (include all the testcases) submission for this problem 
                  const submissions = allTestCases.map((obj)=>({
                  
                    language_id: languageId,

   source_code:
   Buffer.from(
      fullCode
   ).toString(
      "base64"
   ),

   stdin:
   Buffer.from(
      obj.input
   ).toString(
      "base64"
   ),

   expected_output:
   Buffer.from(
      obj.output
   ).toString(
      "base64"
   ),

                 cpu_time_limit:1,
                 memory_limit:256000
        
                  }))
    
                  // Step 1: Submit
                  const submissionResponse = await submitBatch(submissions) 
    
                  // Step 2: Extract tokens
                  const tokens =submissionResponse.map(submission => submission.token);
                  // console.log(tokens);//debugger
    
                  // Step 3: Wait briefly
                  let results;
                  let attempts = 0;
                  const MAX_ATTEMPTS = 10;
    
                while(attempts < MAX_ATTEMPTS)
                 {           
               results = await getBatchResults(tokens);
    
               const isFinished =results.every(result =>result.status.id !== 1 &&result.status.id!== 2)
    
               if(isFinished)
               break;
               attempts++;
    
               await new Promise((res)=>{
               setTimeout(()=>{
               res("")
               },1000)
            });
          }
          if(!results){
                throw new Error("Failed to fetch Judge0 results");
              }
       
              results = results.map((result)=>({

      ...result,

      stdout:
      typeof result.stdout === "string"
      ? Buffer
         .from(
            result.stdout,
            "base64"
         )
         .toString("utf-8")
      : null,

      stderr:
      typeof result.stderr === "string"
      ? Buffer
         .from(
            result.stderr,
            "base64"
         )
         .toString("utf-8")
      : null,

      compile_output:
      typeof result.compile_output === "string"
      ? Buffer
         .from(
            result.compile_output,
            "base64"
         )
         .toString("utf-8")
      : null,

      message:
      typeof result.message === "string"
      ? Buffer
         .from(
            result.message,
            "base64"
         )
         .toString("utf-8")
      : null
   })
);
          
                const allFinished =results.every(result =>result.status.id !== 1 &&result.status.id!== 2);
    
                  if(!allFinished){
                  throw new Error("Judge0 validation timeout");
                }
                  // console.log(results)

                  return results;
}




async function validateRunCode(problemData,referenceSolution) {
  const {visibleTestCases,customTestCases,sourceCode,boilerPlate,language} = problemData;
  
  
  //combine all the testcases
  const allTestCases = [...(visibleTestCases || []),...(customTestCases || [])]

  //we need to have driver code for the given language
  const boilerPlateMap={};
  for(let {language,driverCode} of boilerPlate){
      boilerPlateMap[getlanguageId[language]]=driverCode;
  }

  const languageId = getlanguageId[language]
  const driverCode = boilerPlateMap[languageId]

  //check whether driver code for this language is present or not 
  if(!driverCode)
    throw new Error(`Driver code missing for ${language}`);
                  
  if(!driverCode.includes("{{USER_CODE}}"))
    throw new Error(`USER_CODE placeholder missing in ${language} driver code`);


  //create a complete solution code
  const completeSolution = driverCode.replace("{{USER_CODE}}",sourceCode)
  
  const referenceCode = driverCode.replace("{{USER_CODE}}",referenceSolution)
  //console.log(referenceCode)
  //create batch submission
const submissions = allTestCases.map((testCase)=>{

    const submission = {
        language_id: languageId,
        source_code:Buffer.from(completeSolution).toString("base64"),

        stdin:Buffer.from(testCase.input).toString("base64"),

        cpu_time_limit:1,
        memory_limit:256000
    };

    return submission;
});

const submissionsRef = allTestCases.map((testCase)=>{

    const submission = {
        language_id: languageId,
        source_code:Buffer.from(referenceCode).toString("base64"),

        stdin:Buffer.from(testCase.input).toString("base64"),

        cpu_time_limit:1,
        memory_limit:256000
    };

    return submission;
});    
  //step1->submit
  const submissionResponse = await submitBatch(submissions)
  const referenceResponse = await submitBatch(submissionsRef)
  
  //step2->Extract tokens
  const tokens = submissionResponse.map((obj)=>obj.token)
  const referenceTokens = referenceResponse.map((obj)=>obj.token)

  //step3->make request in intervals of 1 sec
  let results;
  let referenceResult;
  let attempts = 0;
  const MAX_ATTEMPTS = 10;

  while(attempts<MAX_ATTEMPTS)
  {
    results = await getBatchResults(tokens)
    referenceResult = await getBatchResults(referenceTokens)
    const isFinished =results.every(result =>result.status.id !== 1 &&result.status.id!== 2)
    const isFinishedRef =referenceResult.every(referenceResult =>referenceResult.status.id !== 1 &&referenceResult.status.id!== 2)
    if(isFinished&&isFinishedRef)
    break;

    attempts++;

    //wait 1 sec
    await new Promise((resolve)=>{
          setTimeout(()=>{
            resolve("");
          },1000)
    })
  }
  if(!results||!referenceResult)
    throw new Error("Failed to fetch Judge0 results");
    
//   console.log(results)
  results = decodeResults(results)
  referenceResult = decodeResults(referenceResult)

  const allFinished =results.every(result =>result.status.id !== 1 &&result.status.id!== 2);
  const allFinishedRef =referenceResult.every(result =>result.status.id !== 1 &&result.status.id!== 2);
  
  if(!allFinished||!allFinishedRef)
    throw new Error("Judge0 validation timeout");

  
  return results.map(
   (result,index)=>({

      ...result,

      input:allTestCases[index]?.input|| null,

      expectedOutput:referenceResult[index]?.stdout|| null,

      actualOutput:result.stdout ?? "",

      status:
result.status.id !== 3
?
judge0Status[
   result.status.id
]
:
(
   result.stdout?.trim()
   ===
   referenceResult[
      index
   ]?.stdout?.trim()
)
?
"Accepted"
:
"Wrong Answer"
   })
);
}


module.exports = {validateReferenceSolution,validateUserSolution,validateRunCode}