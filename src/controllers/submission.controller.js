const submissionModel = require("../models/submission.model")
const validateSolution = require("../services/validatesolution.service")
const problemModel = require("../models/problem.model")
const judge0Status = require("../utils/problemUtils").JUDGE0_STATUS
const submissionCompletedEvent = require("../events/submissioncompleted.event")


async function submitCode(req,res) {
    
    try{
        const userId = req.userData._id;
        const {language,sourceCode}=req.body;
        const {slug}=req.params;

        //fetch problem from DB
        const problem = await problemModel.findOne({slug}).select("+hiddenTestCases +boilerPlate.driverCode")
              if(!problem)
                return res.status(404).json({message:"Problem not found"});
      
        //check language
        const supportedLanguage = problem.boilerPlate.some(bp =>bp.language ===language);
        if(!supportedLanguage)
        return res.status(400).json({message:"Language not supported for this problem"});


        //store the code in DB first then update it after judge0 result
        const storeUserSolution = await submissionModel.create({userId,problemId:problem._id,language,sourceCode:sourceCode,status:"Pending",totalTestCases:problem.hiddenTestCases.length+problem.visibleTestCases.length})
        //inserting the user code and lang into problemData
        problem.sourceCode=sourceCode
        problem.language=language
        //execute code
        const results = await validateSolution.validateUserSolution(problem)
        
        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let status="Accepted"
        let errorMessage=null;
        for(let obj of results)
        {
            runtime = Math.max(runtime,parseFloat(obj.time || 0))
            memory=Math.max(memory,obj.memory||0)
            if(obj.status.id==3){
               testCasesPassed++;
            }
            else{
                status = judge0Status[obj.status.id]
                errorMessage = obj.stderr||obj.compile_output||obj.message||null;  
                break;
            }
        }

        //update the data in DB
        storeUserSolution.status=status
        storeUserSolution.testCasesPassed=testCasesPassed
        storeUserSolution.errorMessage=errorMessage
        storeUserSolution.runtime=runtime*1000
        storeUserSolution.memory=memory
        
        await storeUserSolution.save();

        

        // update user statistics
        submissionCompletedEvent.emit("submissionCompleted",{
        submission: storeUserSolution,problem
    });

        return res.status(200).json({
   submission:{
      _id:
      storeUserSolution._id,

      status:
      storeUserSolution.status,

      runtime:
      storeUserSolution.runtime,

      memory:
      storeUserSolution.memory,

      testCasesPassed:
      storeUserSolution
      .testCasesPassed,

      totalTestCases:
      storeUserSolution
      .totalTestCases
   }
});
    }
 catch(err){
    console.log(err.response?.data);
    console.log(err.message);
              return res.status(500).json({message:err.message||"Internal server error",});
 }

}



async function runCode(req,res) {
    try{
        const {language,sourceCode,customTestCases}=req.body;
        const {slug} = req.params;
        
        //fetch problem from DB
        const problem = await problemModel.findOne({slug}).select("+boilerPlate.driverCode +referenceSolution")
              if(!problem)
                return res.status(404).json({message:"Problem not found"});
      
        //check language
        const supportedLanguage = problem.boilerPlate.some(bp =>bp.language ===language);
        if(!supportedLanguage)
        return res.status(400).json({message:"Language not supported for this problem"});

        //find reference solution of this lang
        const referenceSolution = problem.referenceSolution.find(sol =>sol.language=== language);
        problem.sourceCode=sourceCode
        problem.language=language
        problem.customTestCases=customTestCases
        // console.log(referenceSolution.completeCode)

        //execute code 
        const results = await validateSolution.validateRunCode(problem,referenceSolution.completeCode)
        let testCasesPassed=0;
        let runtime=0;
        let status="Accepted"
        let errorMessage=null;
        let executionResults = [];
        for(let obj of results)
        {
            runtime = Math.max(runtime,parseFloat(obj.time || 0)*1000)
            if(obj.status === "Accepted"){
               testCasesPassed++;
            }
            else{
                status = obj.status
                errorMessage = obj.stderr||obj.compile_output||obj.message||null; 
                break;
            }
        }
        for(let obj of results)
        {
            executionResults.push({
            input:obj.input,
            expectedOutput:obj.expectedOutput,
            output:obj.actualOutput,

         });

        }

        return res.status(200).json({
               runResult:{
                 status,
                 runtime,
                 testCasesPassed,
                 errorMessage,
                 executionResults
              }
   
});

    }
    catch(err){
       return res.status(500).json({message:err.message||"Internal server error",});
    }
}


async function getUsersAllSubmissions(req,res) {
        const PAGE_SIZE = 20;

    try{
        const page = Number(req.query.page)
        const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

        const skip = (currentPage - 1) * PAGE_SIZE;
        const [totalSubmissions,submissions] = await Promise.all([

            submissionModel.countDocuments({userId:req.userData._id}),

            submissionModel
                .find({userId:req.userData._id})
                .populate({path:"problemId",select:"title slug difficulty"})
                .sort({createdAt:-1})
                .skip(skip)
                .limit(PAGE_SIZE)
                .lean()
        ]);

        // console.log(submissions)
        const totalPages = Math.ceil(totalSubmissions / PAGE_SIZE);

        const formattedSubmissions = submissions.map(sub => ({

                _id:sub._id,

                status:sub.status,

                language:sub.language,

                runtime:sub.runtime,

                memory:sub.memory,

                testCasesPassed:
                    sub.testCasesPassed,

                totalTestCases:
                    sub.totalTestCases,

                createdAt:sub.createdAt,

                problem: sub.problemId
                ? {
                id: sub.problemId._id,
                title: sub.problemId.title,
                slug: sub.problemId.slug,
                difficulty: sub.problemId.difficulty
                  }
                : null
            }));


        return res.status(200).json({

            success:true,

             data: {

                submissions: formattedSubmissions,

                pagination: {

                    currentPage,

                    totalPages,

                    totalSubmissions,

                    pageSize: PAGE_SIZE,

                    hasNextPage: currentPage < totalPages,

                    hasPrevPage: currentPage > 1
                }
            }
        });

    }
    catch(err){

        console.error("Error fetching submissions:",err);

        return res.status(500).json({
            success:false,
            message:"Internal server error"});
    }
}

module.exports = {submitCode,runCode,getUsersAllSubmissions}