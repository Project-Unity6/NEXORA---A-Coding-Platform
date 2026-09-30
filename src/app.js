const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes")
const problemRoutes = require("./routes/problem.routes")
const submissionRoutes = require("./routes/submission.routes")
// const judge0Routes = require("./routes/judge0.routes")



const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



/* register, login , logout, fetch profile   */
app.use("/user/auth",authRoutes)

/* problem routes */
app.use("/problems",problemRoutes)


// /* judge0 routes (tesing purpose)*/
// app.use("/judge0", judge0Routes);


/* Submission routes */
app.use("/submissions",submissionRoutes)

module.exports = app;