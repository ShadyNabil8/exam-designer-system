const express = require("express");
const examRouter = express.Router();
const examController = require("../controllers/examController");

// Even though the operation is "fetching" data, it involves significant customization based on the input data, which makes POST a reasonable and intuitive choice.
examRouter.post("/", examController.generateExam);

module.exports = examRouter;    
