/* DUMMY FILE CHECKING JUDE0 WROKING */



const express = require("express");
const router = express.Router();
const testJudgeController = require("../controllers/testjudge0.controller");

router.get("/test-judge", testJudgeController);





module.exports = router;