const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const problemController = require("../controllers/problem.controller")


/* /problems */
router.get("/", authMiddleware.optionalAuthUserMiddleware, problemController.getAllProblems)

/* /problems/createproblem */
router.post("/createproblem",authMiddleware.authUserMiddleware,problemController.createProblem)


/* /problems/updateproblem */
router.put("/updateproblem/:slug",authMiddleware.authUserMiddleware,problemController.updateProblem)


/* /problems/slug */
router.get("/:slug",problemController.getProblem)


/* /problems/delete/:slug */
router.delete("/delete/:slug",authMiddleware.authUserMiddleware,problemController.deleteProblem)


/* /problems/slug/submissions */
router.get("/:slug/submissions",authMiddleware.authUserMiddleware,problemController.getProblemsubmissions)


/* /problems/slug/submissions/id */
router.get("/:slug/submissions/:id",authMiddleware.authUserMiddleware,problemController.getSubmissionById)

module.exports = router;