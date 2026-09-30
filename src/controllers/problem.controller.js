const problemModel = require("../models/problem.model")
const validateProblem = require("../utils/problem.validator")
const getlanguageId = require("../utils/problemUtils").JUDGE0_LANGUAGE_IDS
const validateSolution = require("../services/validatesolution.service")
const submissionModel = require("../models/submission.model")
const mongoose = require("mongoose");



async function createProblem(req,res){
     
      try{
            //validate user role
            if(req.userData.role !== "admin"){
                return res.status(403).json({message:"Forbidden: Only admins can create problems"})
            }
             //validate problem data
            const {isValid,message} = validateProblem(req.body)

      if(!isValid){
        return res.status(400).json({message})
      }

      //check if problem with same title already exists
      const isProblemExist = await problemModel.findOne({
            $or:[
                {title:req.body.title},
                {slug:req.body.slug}
            ]
      });  
      
      if(isProblemExist){
        return res.status(409).json({message:"Problem with same title or slug already exists"})
      }
      //validate reference solution 
      await validateSolution.validateReferenceSolution(req.body);
      
      //create problem
      req.body.problemAuthor = req.userData._id
      const newProblem = await problemModel.create(req.body)
      return res.status(201).json({message:"Problem created successfully"})

      }
      catch(err){
        console.error("Error creating problem:", err);
        return res.status(500).json({message: err.message || "Internal server error"})
      }

}



async function updateProblem(req,res) {
  
try{
        //validate user role
        if(req.userData.role !== "admin"){
              return res.status(403).json({message:"Forbidden: Only admins can update problems"})
            }
        
            //check if problem even exists
        const {slug} = req.params;    
        const problem = await problemModel.findOne({slug})
        if(!problem)
          return res.status(404).json({message:"Problem not found"})
        
      // //check the newdata given by the user
      // const {isValid,message} = validateProblem(req.body)

      // if(!isValid){
      //   return res.status(400).json({message})
      // }

      //check reference solution
      await validateSolution.validateReferenceSolution(req.body)

      //update the problem(updating manually so that new slug can be generated as findOneAndUpdate will not generate new slug)
      Object.assign(problem,req.body)

      await problem.save();
      return res.status(200).json({message:"Problem updated successfully",Problem:req.body});
     
}
catch(err){
return res.status(500).json({message:err.message||"Internal server error"})
    }

}



async function getProblem(req,res){

  try{
        const {slug} = req.params;

              const problem =await problemModel.findOne({ slug })
 .select(`
   -_id
   title
   slug
   description
   difficulty
   constraints
   tags
   visibleTestCases
   boilerPlate.language
   boilerPlate.initialCode
`)
.lean();

problem.visibleTestCases =
problem.visibleTestCases.map(
   ({ _id, ...rest }) => rest
);

      if(!problem)
      return res.status(404).json({message:"Problem not found"});
      
        return res.status(200).json({problem})
  }
  catch(err)
  {
          console.error("Error fetching problem:",err);
     return res.status(500).json({message:err.message||"Interbal server Error"})
  }

}



async function deleteProblem(req,res){

    try{
        const {slug} = req.params;

        //validate user role
        if(req.userData.role !== "admin"){
              return res.status(403).json({message:"Forbidden: Only admins can delete problems"})
            }
        
        const problem = await problemModel.findOneAndDelete({slug})
        if(!problem)
          return res.status(404).json({message:"Problem not found"})
        
        return res.status(200).json({message:`${slug} Problem deleted successfully.`})
    }
    catch(err){
       return res.status(500).json({message:err.message||"Internal server error"})
    }

}


async function getProblemsubmissions(req,res){
  const PAGE_SIZE=20;
     try{
      const {slug} = req.params;
          
      //check the proble existence 
          const problem = await problemModel.findOne({slug}).lean()
          if(!problem)
            return res.status(404).json({success:false,message:"Invalid problem"})
          
          //pagination 
          const page = Number(req.query.page);
          const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
          const skip = (currentPage-1) * PAGE_SIZE;

          //need to fetch all the submissiosn with the given slug
                  const [totalSubmissions, submissions] = await Promise.all([

            submissionModel.countDocuments({
                userId: req.userData._id,
                problemId: problem._id
            }),

            submissionModel
                .find({
                    userId: req.userData._id,
                    problemId: problem._id
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(PAGE_SIZE)
                .lean()
              ])
        const totalPages = Math.ceil(totalSubmissions / PAGE_SIZE);

        const formattedSubmissions =
            submissions.map(sub => ({

                id: sub._id,

                status: sub.status,

                language: sub.language,

                runtime: sub.runtime,

                memory: sub.memory,

                testCasesPassed: sub.testCasesPassed,

                totalTestCases: sub.totalTestCases,

                createdAt: sub.createdAt

            }));

        return res.status(200).json({

            success: true,

            data: {

                problem: {

                    id: problem._id,

                    title: problem.title,

                    slug: problem.slug,

                    difficulty: problem.difficulty

                },

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
     catch(err)
     {
           console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal server error"

        });
     }
}



async function getSubmissionById(req, res) {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid submission id"
            });
        }

        const submission = await submissionModel
            .findById(id)
            .select("+sourceCode")
            .populate({
                path: "problemId",
                select: "title slug difficulty"
            })
            .lean();

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        if (submission.userId.toString() !== req.userData._id.toString() &&req.userData.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }

        return res.status(200).json({

            success: true,

            data: {

                submission: {

                    id: submission._id,

                    status: submission.status,

                    language: submission.language,

                    runtime: submission.runtime,

                    memory: submission.memory,

                    sourceCode: submission.sourceCode,

                    errorMessage: submission.errorMessage,

                    testCasesPassed: submission.testCasesPassed,

                    totalTestCases: submission.totalTestCases,

                    createdAt: submission.createdAt,

                    problem: submission.problemId
                        ? {
                            id: submission.problemId._id,
                            title: submission.problemId.title,
                            slug: submission.problemId.slug,
                            difficulty: submission.problemId.difficulty
                        }
                        : null
                }
            }
        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

async function getAllProblems(req, res) {
    try {
        const problems = await problemModel
            .find({})
            .select("title slug difficulty tags createdAt")
            .sort({ createdAt: 1 })
            .lean();

        let solvedSlugs = new Set();
        if (req.userData) {
            const acceptedSubmissions = await submissionModel
                .find({
                    userId: req.userData._id,
                    status: "Accepted"
                })
                .select("problemId")
                .lean();

            const solvedProblemIds = acceptedSubmissions.map(s => s.problemId);
            const solvedProblems = await problemModel
                .find({ _id: { $in: solvedProblemIds } })
                .select("slug")
                .lean();

            solvedSlugs = new Set(solvedProblems.map(p => p.slug));
        }

        const formattedProblems = problems.map(prob => ({
            id: prob._id,
            title: prob.title,
            slug: prob.slug,
            difficulty: prob.difficulty,
            tags: prob.tags || [],
            status: solvedSlugs.has(prob.slug) ? "Solved" : "Todo",
            createdAt: prob.createdAt
        }));

        return res.status(200).json({
            success: true,
            problems: formattedProblems
        });
    } catch (err) {
        console.error("Error fetching all problems:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
}

module.exports = {createProblem,updateProblem,getProblem,deleteProblem,getProblemsubmissions,getSubmissionById,getAllProblems}