const express = require("express");
const examRouter = express.Router();
const examController = require("../controllers/examController");
const authenticateUserMiddleware = require("../middlewares/authenticateUserMiddleware");

/**
 * @swagger
 * /api/exams/generate:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Generate an exam based on chapters, difficulty, and objectives.
 *     description: This route generates an exam by selecting questions from a pool based on chapters, difficulty, and objectives.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapters:
 *                 type: object
 *                 description: A mapping of chapter IDs to the number of questions for each chapter.
 *                 example:
 *                   671112a0afe0d6b3ab7ece99: 6
 *                   671113a8afe0d6b3ab7ecea5: 6
 *               difficulty:
 *                 type: object
 *                 description: The distribution of questions by difficulty.
 *                 example:
 *                   simple: 10
 *                   difficult: 2
 *               objective:
 *                 type: object
 *                 description: The distribution of questions by objective.
 *                 example:
 *                   reminding: 10
 *                   understanding: 1
 *                   creativity: 1
 *             required:
 *               - chapters
 *               - difficulty
 *               - objective
 *     responses:
 *       201:
 *         description: Exam generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Exam successfully found
 *                 data:
 *                   type: array
 *                   description: The generated exam with the selected questions
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the question
 *                         example: "67111672afe0d6b3ab7ecf2b"
 *                       chapterId:
 *                         type: string
 *                         description: The ID of the chapter this question belongs to
 *                         example: "671113a8afe0d6b3ab7ecea5"
 *                       text:
 *                         type: string
 *                         description: The question text
 *                         example: "Which gas do plants absorb from the atmosphere?"
 *                       choices:
 *                         type: array
 *                         description: The available choices for the question
 *                         items:
 *                           type: string
 *                         example: ["Carbon Dioxide", "Oxygen", "Nitrogen"]
 *                       correctAnswer:
 *                         type: string
 *                         description: The correct answer to the question
 *                         example: "Carbon Dioxide"
 *                       difficulty:
 *                         type: string
 *                         description: The difficulty level of the question
 *                         enum: [simple, difficult]
 *                         example: "simple"
 *                       objective:
 *                         type: string
 *                         description: The objective type of the question
 *                         enum: [reminding, understanding, creativity]
 *                         example: "reminding"
 *       400:
 *         description: Validation error or no questions available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "There is no any question to make an exam!"
 *                 errors:
 *                   type: array
 *                   description: List of validation errors
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "The number of questions for difficulty must be a valid number"
 *                       param:
 *                         type: string
 *                         example: "difficulty"
 *                       path:
 *                         type: string
 *                         example: "body"
 */
// Even though the operation is "fetching" data, it involves significant customization based on the input data, which makes POST a reasonable and intuitive choice.
examRouter.post(
  "/generate",
  authenticateUserMiddleware,
  examController.generateExam
);

examRouter.post("/", examController.addExam);

module.exports = examRouter;
