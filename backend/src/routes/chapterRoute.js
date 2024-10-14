const express = require("express");
const chapterRouter = express.Router();
const chapterController = require("../controllers/chapterController");

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
chapterRouter.get("/", chapterController.getChapters);

// // GET a single chapter by ID
// chapterRouter.get("/:id", chapterController.getChapter);

// // DELETE a single chapter by ID
// chapterRouter.delete("/:id", chapterController.deleteChapter);

// // UPDATE a single chapter by ID
// chapterRouter.put("/:id", chapterController.updateChapter);

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
 *                 addedChapter:
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
chapterRouter.post("/", chapterController.addChapter);

module.exports = chapterRouter;
