const mongoose = require("mongoose")
const ProblemTags = require("../utils/problemUtils").ProblemTags
const slugify = require("slugify")
const supportedLanguages = require("../utils/problemUtils").SUPPORTED_LANGUAGES


const problemSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true, 
        unique:true,
        trim:true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        required:true,
        immutable:true
    },
    constraints:[
       {
      type:String,
      required:true
   }
   ],
    tags:{
        type:[String],
        enum:ProblemTags,
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
hiddenTestCases:{
   type:[
      {
         input:{
            type:String,
            required:true
         },
         output:{
            type:String,
            required:true
         }
      }
   ],
   select:false
},
    boilerPlate:[
        {
            language:{
                type:String,
                enum:supportedLanguages,
                required:true
        },
        initialCode:{
            type:String,
            required:true
        },
        driverCode:{
            type:String,
            required:true,
            select:false
        }
    }
    ],
    problemAuthor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
referenceSolution:{
   type:[
      {
         language:{
            type:String,
            enum:supportedLanguages,
            required:true
         },

         completeCode:{
            type:String,
            required:true
         }
      }
   ],

   select:false
},
},{timestamps:true})



/* ### lets auto generate slugs from titles ### */

problemSchema.pre("validate", function() {
    if(this.title){
        this.slug = slugify(this.title,{
            lower:true,
            strict:true
        });
    }
    
})





const problemModel = mongoose.model("Problem",problemSchema)

module.exports = problemModel;
