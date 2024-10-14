const express = require("express");
const courseRouter = express.Router();
const courseController = require("../controllers/courseController");

// GET all courses
courseRouter.get("/", courseController.getCourses);

// GET a single course by ID
courseRouter.get("/:id", courseController.getCourse);

// DELETE a single course by ID
courseRouter.delete("/:id", courseController.deleteCourse);

// UPDATE a single course by ID
courseRouter.put("/:id", courseController.updateCourse);

// ADD a single course
courseRouter.post("/", courseController.addCourse);

module.exports = courseRouter;
