const express = require("express");
const questionRouter = express.Router();
const questionController = require("../controllers/questionController");
const authenticateUserMiddleware = require("../middlewares/authenticateUserMiddleware");

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Retrieve a list of all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the question
 *                         example: "60d21b4667d0d8992e610c90"
 *                       text:
 *                         type: string
 *                         description: The text of the question
 *                         example: "What is the capital of France?"
 *                       choices:
 *                         type: array
 *                         description: The possible answers for the question
 *                         items:
 *                           type: string
 *                         example: ["Paris", "London", "Berlin"]
 *                       correctAnswer:
 *                         type: string
 *                         description: The correct answer
 *                         example: "Paris"
 *                       difficulty:
 *                         type: string
 *                         description: The difficulty level of the question
 *                         enum: ["simple", "difficult"]
 *                         example: "simple"
 *                       objective:
 *                         type: string
 *                         description: The objective the question is targeting
 *                         enum: ["reminding", "understanding", "creativity"]
 *                         example: "reminding"
 *                       chapterId:
 *                         type: string
 *                         description: The MongoDB ObjectId of the chapter the question belongs to
 *                         example: "60d21b4667d0d8992e610c85"
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
// GET all questions
questionRouter.get(
  "/",
  authenticateUserMiddleware,
  questionController.getQuestions
);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Retrieve a question by its ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the question
 *     responses:
 *       200:
 *         description: The question was successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The question was successfully fetched."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the question
 *                       example: "670e7caf911a126cb71ea37d"
 *                     text:
 *                       type: string
 *                       description: The question text
 *                       example: "What is the capital of France?"
 *                     choices:
 *                       type: array
 *                       description: The possible answers for the question
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
 *                       enum: ["simple", "difficult"]
 *                       example: "simple"
 *                     objective:
 *                       type: string
 *                       description: The objective the question is targeting
 *                       enum: ["reminding", "understanding", "creativity"]
 *                       example: "reminding"
 *                     chapterId:
 *                       type: string
 *                       description: The MongoDB ObjectId of the chapter the question belongs to
 *                       example: "670e790b7ba09c93577312ae"
 *                     chapter:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The unique identifier of the chapter
 *                           example: "670e790b7ba09c93577312ae"
 *                         courseId:
 *                           type: string
 *                           description: The MongoDB ObjectId of the course to which the chapter belongs
 *                           example: "670e78f77ba09c93577312a9"
 *                         name:
 *                           type: string
 *                           description: The name of the chapter
 *                           example: "Introduction to CS50"
 *                         number:
 *                           type: integer
 *                           description: The chapter number
 *                           example: 1
 *                         course:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: The unique identifier of the course
 *                               example: "670e78f77ba09c93577312a9"
 *                             name:
 *                               type: string
 *                               description: The name of the course
 *                               example: "CS50"
 *                             numberOfChapters:
 *                               type: integer
 *                               description: The number of chapters in the course
 *                               example: 1
 *       400:
 *         description: Invalid question ID
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
 *                         example: "Invalid question ID"
 *                       param:
 *                         type: string
 *                         example: "id"
 *                       location:
 *                         type: string
 *                         example: "params"
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question not found"
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
// GET a single question by ID
questionRouter.get(
  "/:id",
  authenticateUserMiddleware,
  questionController.getQuestion
);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question by its ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the question to delete
 *     responses:
 *       200:
 *         description: The question was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The question was successfully deleted."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the deleted question
 *                       example: "60d21b4667d0d8992e610c85"
 *                     text:
 *                       type: string
 *                       description: The text of the question
 *                       example: "What is the capital of France?"
 *                     choices:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: The possible answers for the question
 *                       example: ["Paris", "London", "Berlin"]
 *                     correctAnswer:
 *                       type: string
 *                       description: The correct answer
 *                       example: "Paris"
 *                     difficulty:
 *                       type: string
 *                       description: The difficulty level of the question
 *                       enum: ["simple", "difficult"]
 *                       example: "simple"
 *                     objective:
 *                       type: string
 *                       description: The objective of the question
 *                       enum: ["reminding", "understanding", "creativity"]
 *                       example: "reminding"
 *                     chapterId:
 *                       type: string
 *                       description: The MongoDB ObjectId of the chapter the question belongs to
 *                       example: "60d21b4667d0d8992e610c80"
 *       400:
 *         description: Invalid question ID
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
 *                         example: "Invalid question ID"
 *                       param:
 *                         type: string
 *                         example: "id"
 *                       location:
 *                         type: string
 *                         example: "params"
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question not found"
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
// DELETE a single question by ID
questionRouter.delete(
  "/:id",
  authenticateUserMiddleware,
  questionController.deleteQuestion
);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question by its ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the chapter the question belongs to
 *                 example: "60d21b4667d0d8992e610c85"
 *               text:
 *                 type: string
 *                 description: The text of the question
 *                 example: "What is the capital of France?"
 *               choices:
 *                 type: array
 *                 description: The possible answers for the question (must contain exactly 3 items)
 *                 items:
 *                   type: string
 *                 example: ["Paris", "London", "Berlin"]
 *               correctAnswer:
 *                 type: string
 *                 description: The correct answer for the question
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
 *       200:
 *         description: The question was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chapter updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the updated question
 *                       example: "60d21b4667d0d8992e610c85"
 *                     chapterId:
 *                       type: string
 *                       description: The MongoDB ObjectId of the chapter the question belongs to
 *                       example: "60d21b4667d0d8992e610c85"
 *                     text:
 *                       type: string
 *                       description: The text of the question
 *                       example: "What is the capital of France?"
 *                     choices:
 *                       type: array
 *                       description: The possible answers for the question
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
 *                       enum: ["simple", "difficult"]
 *                       example: "simple"
 *                     objective:
 *                       type: string
 *                       description: The objective of the question
 *                       enum: ["reminding", "understanding", "creativity"]
 *                       example: "reminding"
 *       400:
 *         description: Invalid input data
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
 *                         example: "Invalid question ID"
 *                       param:
 *                         type: string
 *                         example: "id"
 *                       location:
 *                         type: string
 *                         example: "params"
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question not found"
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
// UPDATE a single question by ID
questionRouter.put(
  "/:id",
  authenticateUserMiddleware,
  questionController.updateQuestion
);

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
questionRouter.post(
  "/",
  authenticateUserMiddleware,
  questionController.addQuestion
);

module.exports = questionRouter;
