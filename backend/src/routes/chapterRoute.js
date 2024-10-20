const express = require("express");
const chapterRouter = express.Router();
const chapterController = require("../controllers/chapterController");
const authenticateUserMiddleware = require("../middlewares/authenticateUserMiddleware");

/**
 * @swagger
 * /api/chapters:
 *   get:
 *     summary: Retrieve a list of all chapters
 *     tags: [Chapters]
 *     responses:
 *       200:
 *         description: A list of chapters
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
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the chapter
 *                         example: "60d21b4667d0d8992e610c90"
 *                       name:
 *                         type: string
 *                         description: The name of the chapter
 *                         example: "Introduction to CS50"
 *                       number:
 *                         type: integer
 *                         description: The chapter number
 *                         example: 1
 *                       courseId:
 *                         type: string
 *                         description: The MongoDB ObjectId of the course to which the chapter belongs
 *                         example: "60d21b4667d0d8992e610c85"
 *                       maxNumberOfQuestions:
 *                         type: number
 *                         description: The maximum number of question that this chapter can have
 *                         example: 30
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
// GET all chapters
chapterRouter.get(
  "/",
  authenticateUserMiddleware,
  chapterController.getChapters
);

/**
 * @swagger
 * /api/chapters/{id}:
 *   get:
 *     summary: Retrieve a chapter by its ID
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the chapter
 *     responses:
 *       200:
 *         description: The chapter was successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The chapter was successfully fetched."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the chapter
 *                       example: "670d79a9ae472f7c22fcc7ba"
 *                     name:
 *                       type: string
 *                       description: The name of the chapter
 *                       example: "chapter C"
 *                     number:
 *                       type: integer
 *                       description: The chapter number
 *                       example: 5
 *                     course:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The unique identifier of the course
 *                           example: "670d2c7249825f9c3cd678bc"
 *                         name:
 *                           type: string
 *                           description: The name of the course
 *                           example: "CS50_NEW"
 *                         numberOfChapters:
 *                           type: integer
 *                           description: The number of chapters in the course
 *                           example: 5
 *       400:
 *         description: Invalid chapter ID
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
 *                         example: "Invalid chapter ID"
 *                       param:
 *                         type: string
 *                         example: "id"
 *                       path:
 *                         type: string
 *                         example: "params"
 *       404:
 *         description: Chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chapter not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
// GET a single chapter by ID
chapterRouter.get(
  "/:id",
  authenticateUserMiddleware,
  chapterController.getChapter
);

/**
 * @swagger
 * /api/chapters/{id}/questions:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: Get questions for a specific chapter
 *     description: Retrieves a list of questions associated with the given chapter ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chapter
 *         example: "671112a0afe0d6b3ab7ece99"
 *     responses:
 *       200:
 *         description: The questions were successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The questions were successfully fetched."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "671114f2afe0d6b3ab7eced6"
 *                       chapterId:
 *                         type: string
 *                         description: The ID of the chapter this question belongs to
 *                         example: "671112a0afe0d6b3ab7ece99"
 *                       text:
 *                         type: string
 *                         description: The question text
 *                         example: "Which planet is known as the Red Planet?"
 *                       choices:
 *                         type: array
 *                         description: The available choices for the question
 *                         items:
 *                           type: string
 *                         example: ["Mars", "Venus", "Jupiter"]
 *                       correctAnswer:
 *                         type: string
 *                         description: The correct answer to the question
 *                         example: "Mars"
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
 *         description: Invalid chapter ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Validation errors
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Invalid chapter ID"
 *                       path:
 *                         type: string
 *                         example: "id"
 *                       location:
 *                         type: string
 *                         example: "params"
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
// GET a all questions for this chapter
chapterRouter.get(
  "/:id/questions",
  authenticateUserMiddleware,
  chapterController.getChapterQuestions
);

/**
 * @swagger
 * /api/chapters/{id}:
 *   delete:
 *     summary: Delete a chapter by its ID
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the chapter to delete
 *     responses:
 *       200:
 *         description: The chapter was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The chapter was successfully deleted."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the deleted chapter
 *                       example: "60d21b4667d0d8992e610c90"
 *                     name:
 *                       type: string
 *                       description: The name of the chapter
 *                       example: "Chapter C"
 *                     number:
 *                       type: integer
 *                       description: The chapter number
 *                       example: 3
 *                     courseId:
 *                       type: string
 *                       description: The MongoDB ObjectId of the course to which the chapter belonged
 *                       example: "60d21b4667d0d8992e610c85"
 *                     __v:
 *                       type: integer
 *                       description: The version key of the chapter document
 *                       example: 0
 *       400:
 *         description: Invalid chapter ID
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
 *                         example: "Invalid chapter ID"
 *                       param:
 *                         type: string
 *                         example: "id"
 *                       path:
 *                         type: string
 *                         example: "params"
 *       404:
 *         description: Chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chapter not found"
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
// DELETE a single chapter by ID
chapterRouter.delete(
  "/:id",
  authenticateUserMiddleware,
  chapterController.deleteChapter
);

/**
 * @swagger
 * /api/chapters/{id}:
 *   put:
 *     summary: Update a chapter by its ID
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the chapter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the chapter
 *                 example: "Chapter A"
 *               number:
 *                 type: integer
 *                 description: The chapter number (must be a positive integer)
 *                 example: 1
 *               courseId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the course the chapter belongs to
 *                 example: "60d21b4667d0d8992e610c85"
 *               maxNumberOfQuestions:
 *                 type: integer
 *                 description: Maximum number of questions that this chapter can carry.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Chapter updated successfully
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
 *                       description: The unique identifier of the chapter
 *                       example: "60d21b4667d0d8992e610c90"
 *                     name:
 *                       type: string
 *                       description: The name of the chapter
 *                       example: "Chapter A"
 *                     number:
 *                       type: integer
 *                       description: The chapter number
 *                       example: 1
 *                     courseId:
 *                       type: string
 *                       description: The MongoDB ObjectId of the course
 *                       example: "60d21b4667d0d8992e610c85"
 *                     __v:
 *                       type: integer
 *                       description: The version key of the chapter document
 *                       example: 0
 *       400:
 *         description: Invalid input or validation errors
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
 *                         example: "Chapter name is required!"
 *                       param:
 *                         type: string
 *                         example: "name"
 *                       path:
 *                         type: string
 *                         example: "body"
 *       404:
 *         description: Chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chapter not found"
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
// UPDATE a single chapter by ID
chapterRouter.put(
  "/:id",
  authenticateUserMiddleware,
  chapterController.updateChapter
);

/**
 * @swagger
 * /api/chapters:
 *   post:
 *     summary: Add a new chapter to a course
 *     tags: [Chapters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the chapter
 *                 example: "Introduction to CS50"
 *               number:
 *                 type: integer
 *                 description: The chapter number (must be a positive integer)
 *                 example: 1
 *               courseId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the course to which the chapter belongs
 *                 example: "60d21b4667d0d8992e610c85"
 *               maxNumberOfQuestions:
 *                 type: integer
 *                 description: Maximum number of questions that this chapter can carry.
 *                 example: 5
 *     responses:
 *       200:
 *         description: The chapter was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The chapter was successfully added."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the chapter
 *                       example: "60d21b4667d0d8992e610c90"
 *                     name:
 *                       type: string
 *                       description: The name of the chapter
 *                       example: "Introduction to CS50"
 *                     number:
 *                       type: integer
 *                       description: The chapter number
 *                       example: 1
 *                     courseId:
 *                       type: string
 *                       description: The course ID to which the chapter belongs
 *                       example: "60d21b4667d0d8992e610c85"
 *                     course:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The unique identifier of the course
 *                           example: "64f7a9e1b3f8ae23f82c7db1"
 *                         name:
 *                           type: string
 *                           description: The name of the course
 *                           example: "CS50"
 *                         numberOfChapters:
 *                           type: integer
 *                           description: The number of chapters
 *                           example: 5
 *       400:
 *         description: Invalid input data (validation errors)
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
 *                         example: "Chapter name is required!"
 *                       path:
 *                         type: string
 *                         example: "name"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
// ADD a single chapter
chapterRouter.post(
  "/",
  authenticateUserMiddleware,
  chapterController.addChapter
);

module.exports = chapterRouter;
