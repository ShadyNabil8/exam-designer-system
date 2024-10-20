const express = require("express");
const courseRouter = express.Router();
const courseController = require("../controllers/courseController");
const authenticateUserMiddleware = require("../middlewares/authenticateUserMiddleware");

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses
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
 *                         description: The unique identifier of the course
 *                         example: "64f7a9e1b3f8ae23f82c7db1"
 *                       name:
 *                         type: string
 *                         description: The name of the course
 *                         example: "CS50"
 *                       numberOfChapters:
 *                         type: integer
 *                         description: The number of chapters in the course
 *                         example: 5
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database error"
 */

// GET all courses
courseRouter.get("/", authenticateUserMiddleware, courseController.getCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by its ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the course
 *     responses:
 *       200:
 *         description: The course was successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The course was successfully fetched."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the course
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       description: The name of the course
 *                       example: "CS50"
 *                     numberOfChapters:
 *                       type: integer
 *                       description: The number of chapters in the course
 *                       example: 5
 *       400:
 *         description: Invalid course ID
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
 *                         example: "Invalid course ID"
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
// GET a single course by ID
courseRouter.get(
  "/:id",
  authenticateUserMiddleware,
  courseController.getCourse
);

/**
 * @swagger
 * /api/courses/{id}/chapters:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Fetch all chapters for a specific course
 *     description: Retrieves all chapters associated with a given course by course ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *         example: "6712137bfd670c8782b3aaea"
 *     responses:
 *       200:
 *         description: Course chapters were successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course chapters were successfully fetched."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "671254ac7fd685b10afaefbc"
 *                       courseId:
 *                         type: string
 *                         description: The ID of the course the chapter belongs to
 *                         example: "6712137bfd670c8782b3aaea"
 *                       name:
 *                         type: string
 *                         description: The name of the chapter
 *                         example: "ITest"
 *                       number:
 *                         type: integer
 *                         description: The chapter number
 *                         example: 1
 *                       maxNumberOfQuestions:
 *                         type: integer
 *                         description: Maximum number of questions allowed in the chapter
 *                         example: 5
 *       400:
 *         description: Invalid course ID
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
 *                         example: "Invalid course ID"
 *                       param:
 *                         type: string
 *                         example: "id"
 *                       path:
 *                         type: string
 *                         example: "params"
 */
// GET all the course's chapters
courseRouter.get(
  "/:id/chapters",
  authenticateUserMiddleware,
  courseController.getCourseChapters
);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course by its ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the course
 *     responses:
 *       200:
 *         description: The course was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The course was successfully deleted."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the course
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       description: The name of the course
 *                       example: "CS50"
 *                     numberOfChapters:
 *                       type: integer
 *                       description: The number of chapters in the course
 *                       example: 5
 *       400:
 *         description: Invalid course ID
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
 *                         example: "Invalid course ID"
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

// DELETE a single course by ID
courseRouter.delete(
  "/:id",
  authenticateUserMiddleware,
  courseController.deleteCourse
);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course by its ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the course
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
 *     responses:
 *       200:
 *         description: The course was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the course
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       description: The name of the course
 *                       example: "CS50"
 *                     numberOfChapters:
 *                       type: integer
 *                       description: The number of chapters in the course
 *                       example: 5
 *       400:
 *         description: Invalid course ID or validation error
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
 *                       param:
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
// UPDATE a single course by ID
courseRouter.put(
  "/:id",
  authenticateUserMiddleware,
  courseController.updateCourse
);

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

// ADD a single course
courseRouter.post("/", authenticateUserMiddleware, courseController.addCourse);

module.exports = courseRouter;
