const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const database = require("../database");
const {
  chapterUpdateValidation,
  addChapterValidation,
  getChapterValidation,
  getChapterQuestionsValidation,
  deleteChapterValidation,
} = require("../middlewares/chapterValidationMiddlewares");

const addChapter = [
  addChapterValidation,
  asyncHandler(async (req, res) => {
    const { name, number, maxNumberOfQuestions, courseId } = req.body;
    const addedChapter = await database.addChapter(
      name,
      number,
      maxNumberOfQuestions,
      courseId
    );

    res.status(200).json({
      message: "The chapter was successfully added.",
      data: addedChapter,
    });
  }),
];

const getChapters = asyncHandler(async (req, res) => {
  const chapters = await database.getChapters();

  res.status(200).json({ data: chapters });
});

const getChapter = [
  getChapterValidation,
  asyncHandler(async (req, res) => {
    const chapterId = req.params.id;

    const chapter = await database.getChapter(chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json({
      message: "The chapter was successfully fetched.",
      data: chapter,
    });
  }),
];

const getChapterQuestions = [
  getChapterQuestionsValidation,
  asyncHandler(async (req, res) => {
    const chapterId = req.params.id;

    const questions = await database.getQuestionsByChapter(chapterId);

    res.status(200).json({
      message: "The questions was successfully fetched.",
      data: questions,
    });
  }),
];

const deleteChapter = [
  deleteChapterValidation,
  asyncHandler(async (req, res) => {
    const chapterId = req.params.id;

    const deletedChapter = await database.deleteChapter(chapterId);

    if (!deletedChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json({
      message: "The chapter was successfully deleted.",
      data: deletedChapter,
    });
  }),
];

const updateChapter = [
  chapterUpdateValidation,
  asyncHandler(async (req, res) => {
    const chapterId = req.params.id;
    const { name, number, maxNumberOfQuestions, courseId } = req.body;

    const updatedChapter = await database.updateChapter(
      chapterId,
      name,
      number,
      maxNumberOfQuestions,
      courseId
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res
      .status(200)
      .json({ message: "Chapter updated successfully", data: updatedChapter });
  }),
];

module.exports = {
  addChapter,
  getChapters,
  getChapterQuestions,
  getChapter,
  deleteChapter,
  updateChapter,
};
