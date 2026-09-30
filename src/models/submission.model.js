const mongoose =require("mongoose");

const supportedLanguages =require("../utils/problemUtils").SUPPORTED_LANGUAGES;

const submissionSchema = new mongoose.Schema({

   userId:{
      type:
      mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
   },

   problemId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Problem",
      required:true
   },

   language:{
      type:String,
      enum:supportedLanguages,
      required:true,
      default:"cpp"
   },

   sourceCode:{
      type:String,
      required:true,
      select:false
   },

   status:{
      type:String,
      enum:[
         "Accepted",
         "Wrong Answer",
         "Time Limit Exceeded",
         "Memory Limit Exceeded",
         "Compilation Error",
         "Runtime Error",
         "Pending",
         "Internal Error",
         "Exec Format Error"
      ],
      default:"Pending"
   },

   runtime:{
      type:Number,
      default:null
   },

   memory:{
      type:Number,
      default:null
   },

   errorMessage:{
      type:String,
      default:null
   },
   testCasesPassed:{
    type:Number,
    default:0
   },
   totalTestCases:{
    type:Number,
    default:0
   }

},
{
   timestamps:true
});

submissionSchema.index({userId:1,createdAt:-1});

submissionSchema.index({problemId:1,createdAt:-1});

submissionSchema.index({userId:1,problemId:1,createdAt:-1});

const submissionModel = mongoose.model("Submission",submissionSchema);

module.exports = submissionModel;