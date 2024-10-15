const express = require("express");
const questionRouter = express.Router();
const questionController = require("../controllers/questionController");

// GET all questions
questionRouter.get("/", questionController.getQuestions);

// GET a single question by ID
questionRouter.get("/:id", questionController.getQuestion);

// DELETE a single question by ID
questionRouter.delete("/:id", questionController.deleteQuestion);

// UPDATE a single question by ID
questionRouter.put("/:id", questionController.updateQuestion);

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Add a new question to a chapter
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the chapter
 *                 example: "60d21b4667d0d8992e610c85"
 *               text:
 *                 type: string
 *                 description: The text of the question
 *                 example: "What is the capital of France?"
 *               choices:
 *                 type: array
 *                 description: A list of possible answers for the question (must have at least 3)
 *                 items:
 *                   type: string
 *                 example: ["Paris", "London", "Berlin"]
 *               correctAnswer:
 *                 type: string
 *                 description: The correct answer, which must match one of the choices
 *                 example: "Paris"
 *               difficulty:
 *                 type: string
 *                 description: The difficulty level of the question (either 'simple' or 'difficult')
 *                 enum: ["simple", "difficult"]
 *                 example: "simple"
 *               objective:
 *                 type: string
 *                 description: The objective the question is targeting (either 'reminding', 'understanding', or 'creativity')
 *                 enum: ["reminding", "understanding", "creativity"]
 *                 example: "reminding"
 *     responses:
 *       201:
 *         description: Question added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question added successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The MongoDB ObjectId of the new question
 *                       example: "60d21b4667d0d8992e610c90"
 *                     chapterId:
 *                       type: string
 *                       description: The MongoDB ObjectId of the chapter to which the question belongs
 *                       example: "60d21b4667d0d8992e610c85"
 *                     text:
 *                       type: string
 *                       description: The text of the question
 *                       example: "What is the capital of France?"
 *                     choices:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Paris", "London", "Berlin"]
 *                     correctAnswer:
 *                       type: string
 *                       description: The correct answer
 *                       example: "Paris"
 *                     difficulty:
 *                       type: string
 *                       description: The difficulty level of the question
 *                       example: "simple"
 *                     objective:
 *                       type: string
 *                       description: The objective of the question
 *                       example: "reminding"
 *       400:
 *         description: Validation errors or chapter reached the question limit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Choices must be an array with at least 3 items."
 *                       param:
 *                         type: string
 *                         example: "choices"
 *                       path:
 *                         type: string
 *                         example: "body"
 *                 message:
 *                   type: string
 *                   example: "This chapter reached the limit for the number of questions."
 *       404:
 *         description: Chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chapter not found!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
// ADD a single question
questionRouter.post("/", questionController.addQuestion);

module.exports = questionRouter;
