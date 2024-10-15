const express = require("express");
const questionRouter = express.Router();
const questionController = require("../controllers/questionController");

// // GET all questions
// questionRouter.get("/", questionController.getQuestions);

// // GET a single question by ID
// questionRouter.get("/:id", questionController.getQuestion);

// // DELETE a single question by ID
// questionRouter.delete("/:id", questionController.deleteQuestion);

// // UPDATE a single question by ID
// questionRouter.put("/:id", questionController.updateQuestion);

// ADD a single question
questionRouter.post("/", questionController.addQuestion);

module.exports = questionRouter;
