const supportedLanguages = require("../utils/problemUtils").SUPPORTED_LANGUAGES
const problemTags = require("../utils/problemUtils").problemTags


 function validateProblem(problem) {

   //layer 1 check is (visibleTestCases ,hiddenTestCases,boilerPlate,referenceSolution,constraints) is array of objects with input and output
    if (!Array.isArray(problem.visibleTestCases) || !Array.isArray(problem.hiddenTestCases) || 
    !Array.isArray(problem.boilerPlate) || !Array.isArray(problem.referenceSolution) || 
    !Array.isArray(problem.constraints)||!Array.isArray(problem.tags)) {
        return { isValid: false, message: "visibleTestCases, hiddenTestCases, boilerPlate, referenceSolution, tags, and constraints must be arrays." };
    }
        //check if field is  empty
    if (!problem.title ||problem.title.trim() === "" || !problem.description ||
    problem.description.trim() === "" || !problem.difficulty||problem.tags.length===0||problem.constraints.length===0
        ||problem.visibleTestCases.length === 0||problem.hiddenTestCases.length === 0||
         problem.boilerPlate.length === 0||problem.referenceSolution.length === 0
    ) {
        return { isValid: false, message: "All fields are required and must not be empty." };
    }
    const checkdifficulties = ["easy", "medium", "hard"];
    if (!checkdifficulties.includes(problem.difficulty)) {
        return { isValid: false, message: "Difficulty must be one of: easy, medium, hard." };
    }
    
    //tags validation
    for(let tag of problem.tags){
        if(!problemTags.includes(tag)){
            return {isValid:false,message:`Invalid tag: ${tag}. Allowed tags are: ${problemTags.join(", ")}`}
        }
    }
    //layer-2 check if details of (visibleTestCases ,hiddenTestCases,boilerPlate,referenceSolution,constraints) are valid and meaningful
    //1.check constraints
    for(let constraint of problem.constraints){
        if(typeof constraint !== "string" || constraint.trim() === ""){
            return {isValid:false,message:"Each constraint must be a non-empty string."}
        }
    }
        //2.check visibleTestCases
        for(let testCase of problem.visibleTestCases){
            if(typeof testCase.input !== "string" || typeof testCase.output !== "string" || typeof testCase.explanation !== "string" ||
             testCase.input.trim() === "" || testCase.output.trim() === "" || testCase.explanation.trim() === ""){
                return {isValid:false,message:"Each visible test case must have non-empty string input, output, and explanation."}
            }
        }
        //3.check hiddenTestCases
        for(let testCase of problem.hiddenTestCases){
            if(typeof testCase.input !== "string" || typeof testCase.output !== "string" ||
             testCase.input.trim() === "" || testCase.output.trim() === ""){
                return {isValid:false,message:"Each hidden test case must have non-empty string input and output."}
            }
        }
        //3.check boilerPlate
        for(let {language,initialCode,driverCode} of problem.boilerPlate){
            if(typeof language !== "string" || typeof initialCode !== "string" || typeof driverCode !== "string" ||
             language.trim() === "" || initialCode.trim() === ""||driverCode.trim()===""||!supportedLanguages.includes(language)){
                return {isValid:false,message:"Each boilerplate entry must have non-empty string language , initialCode and driverCode."}
            }
        }
            //4.check referenceSolution
            for(let {language,completeCode} of problem.referenceSolution){
                if(typeof language !== "string" || typeof completeCode !== "string" ||
                 language.trim() === "" || completeCode.trim() === ""||!supportedLanguages.includes(language)){
                    return {isValid:false,message:"Each reference solution entry must have non-empty string language and completeCode."}
                }
    }
       return {
   isValid:true,
   message:"Validation successful"
} 

}


module.exports = validateProblem ;