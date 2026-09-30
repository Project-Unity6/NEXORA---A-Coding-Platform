##  User Schema 

  - username,
  - email,
  - password,
  - role,
  - solvedProblems,
  - createdAt, --- \ {timestamps:true}
  - updatedAt  --- /

## Problem Schema 

- title
- description
- difficulty
- constraints
- starter code
- visible test cases
- hidden test cases
- tags
- problem author
- refrence solution
  

## Judge0 submission format
- source_code
- language_id
- stdin
- expected_output  
- cpu_time_limit -> Default runtime limit for every program. Time in which the OS assigns the     
  processor to different tasks is not counted.
- cpu_extra_time -> When a time limit is exceeded, wait for extra time, before killing the program. 
  This has the advantage that the real execution time is reported, even though it slightly exceeds the limit.(can be skipped as of now)
- memory_limit -> Limit address space of the program.
- stack_limit -> Limit process stack(not sure).
- additional_files -> Additional files that should be available alongside the source code. Value of 
  this string should represent the content of a .zip that contains additional files. This attribute is required for multi-file programs.(not sure)
- stdout -> 	Standard output of the program after execution.
- stderr -> Standard error of the program after execution.
- compile_output -> Compiler output after compilation.
- message -> If submission status is Internal Error then this message comes from Judge0 itself, 
  otherwise this is status message from isolate.(not sure)
- status -> Submission status.
- time -> Program’s run time.
- memory -> Memory used by the program after execution.

Submission System Must Handle

✅ submitted code
✅ language
✅ runtime
✅ memory
✅ verdict
✅ testcase results
✅ execution status
✅ timestamps
✅ problem relation
✅ user relation

const JUDGE0_LANGUAGE_IDS = {
    cpp: 54,
    java: 62,
    javascript: 63,
    python: 71,
    c: 50
};


 {
    stdout: '2 3',
    time: '0.006',
    memory: 6708,
    stderr: null,
    token: '7cf07419-e8eb-4f17-b031-c802a7b99574',
    compile_output: null,
    message: null,
    status: { id: 3, description: 'Accepted' }
  },




  GET /user/profile?year=2026

        │

        ▼

Promise.all()

        │

 ┌──────┼──────────┐

 ▼      ▼          ▼

User  UserStats  UserActivity

        │

        ▼

Compute Derived Fields

• acceptanceRate
• totalSolved
• totalSubmissions (year)
• activeDays
• longestStreak (year)

        │

        ▼

Return Unified Profile Response