const express = require("express")
const router = express.Router();
const submissionController = require("../controllers/submission.controller");
const { authUserMiddleware } = require("../middleware/auth.middleware");



/* /submissions/:slug*/
router.post("/:slug",authUserMiddleware,submissionController.submitCode)

/* /submissions/:slug/run */
router.post("/:slug/run",authUserMiddleware,submissionController.runCode)

/* /submissions/progress */
router.get("/progress",authUserMiddleware,submissionController.getUsersAllSubmissions,)

module.exports = router;