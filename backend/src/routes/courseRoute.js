const express = require("express");
const courseRouter = express.Router();
const courseController = require("../controllers/courseController");

// // GET all courses
// courseRouter.get("/", courseController.getCourses);

// // GET a single course by ID
// courseRouter.get("/:id", courseController.getCourse);

// // DELETE a single course by ID
// courseRouter.delete("/:id", courseController.deleteCourse);

// // UPDATE a single course by ID
// courseRouter.put("/:id", courseController.updateCourse);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the course
 *                 example: "CS50"
 *               numberOfChapters:
 *                 type: integer
 *                 description: The number of chapters in the course (must be a positive integer)
 *                 example: 5
 *     responses:
 *       200:
 *         description: The course was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The course was successfully added."
 *                 addedCourse:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the course
 *                       example: "64f7a9e1b3f8ae23f82c7db1"
 *                     name:
 *                       type: string
 *                       description: The name of the course
 *                       example: "CS50"
 *                     numberOfChapters:
 *                       type: integer
 *                       description: The number of chapters
 *                       example: 5
 *       400:
 *         description: Bad request (validation errors)
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
 *                         example: "Course name is required!"
 *                       path:
 *                         type: string
 *                         example: "name"
 */

// ADD a single course
courseRouter.post("/", courseController.addCourse);

module.exports = courseRouter;
