const mongoose = require("mongoose");
const courseModel = require("./models/courseModel");
const chapterModel = require("./models/chapterModel");
const questionModel = require("./models/questionModel");
const userModel = require("./models/userModel");
const verificationCodeModel = require("./models/verificationCodeModel");
const examModel = require("./models/examModel");
const { CustomError } = require("./middlewares/errorHandlerMiddleware");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

async function addCourse(name, numberOfChapters) {
  const addedCourse = await courseModel.create({
    name,
    numberOfChapters,
  });
  return addedCourse;
}

async function getCourses() {
  const courses = await courseModel.find({}).lean();
  return courses;
}

async function getCourse(id) {
  const course = await courseModel.findById(id).lean({ virtuals: true });
  return course;
}

async function deleteCourse(id) {
  const course = await courseModel.findByIdAndDelete(id);
  return course;
}

async function updateCourse(id, updatedData) {
  const updatedCourse = await courseModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: false,
  });
  return updatedCourse;
}

async function isCourseExistsById(courseId) {
  const courseExists = await courseModel.exists({ _id: courseId });
  return courseExists;
}

async function addChapter(name, number, maxNumberOfQuestions, courseId) {
  const addedChapter = await chapterModel.create({
    name,
    number,
    maxNumberOfQuestions,
    courseId,
  });
  return addedChapter;
}

async function getChapters() {
  const chapters = await chapterModel.find({}).lean();
  return chapters;
}

async function getChaptersByCourse(courseId) {
  const chapters = await chapterModel.find({ courseId }).lean();
  return chapters;
}

async function getChapter(id) {
  const chapter = await chapterModel
    .findById(id)
    .populate("course")
    .lean({ virtuals: true });
  return chapter;
}

async function findChaptersByIds(chapterIds) {
  const chapters = await chapterModel.find({ _id: { $in: chapterIds } }).lean();
  return chapters;
}

// This function used to check if a certain question exists or not.
// If the chapterId param is defined, then we need to check if there is a chapter that has this number but not this chapterId
// If the chapterId param is not defined, then we need to check if there is a chapter that has this number
async function isChapterExists(number, courseId, chapterId = null) {
  const query = { courseId, number };

  if (chapterId) {
    query._id = { $ne: chapterId };
  }

  const chapterExists = await chapterModel.exists(query);
  return chapterExists;
}

async function isChapterExistsById(chapterId) {
  const chapterExists = await chapterModel.exists({ _id: chapterId });
  return chapterExists;
}

async function deleteChapter(id) {
  const deletedChapter = await chapterModel.findByIdAndDelete(id);
  return deletedChapter;
}

async function updateChapter(id, name, number, maxNumberOfQuestions, courseId) {
  const updatedChapter = await chapterModel.findByIdAndUpdate(
    id,
    {
      name,
      number,
      maxNumberOfQuestions,
      courseId,
    },
    {
      new: true,
      runValidators: false,
    }
  );
  return updatedChapter;
}

async function addQuestion(
  chapterId,
  text,
  choices,
  correctAnswer,
  difficulty,
  objective
) {
  const addedQuestion = await questionModel.create({
    chapterId,
    text,
    choices,
    correctAnswer,
    difficulty,
    objective,
  });
  return addedQuestion;
}

// Get the number of questions in a certain chapter.
async function getNumberOfQuestion(chapterId) {
  const questionCount = await questionModel.countDocuments({ chapterId });
  return questionCount;
}

async function getQuestions() {
  const questions = await questionModel.find({}).lean();
  return questions;
}

async function getQuestion(id) {
  const question = await questionModel
    .findById(id)
    .populate({
      path: "chapter",
      populate: {
        path: "course", // Populate the course inside the chapter
      },
    })
    .lean({ virtuals: true });
  return question;
}

async function deleteQuestion(id) {
  const deletedQuestion = await questionModel.findByIdAndDelete(id);
  return deletedQuestion;
}

async function updateQuestion(
  questionId,
  chapterId,
  text,
  choices,
  correctAnswer,
  difficulty,
  objective
) {
  const updatedQuestion = await questionModel.findByIdAndUpdate(
    questionId,
    {
      chapterId,
      text,
      choices,
      correctAnswer,
      difficulty,
      objective,
    },
    {
      new: true,
      runValidators: false,
    }
  );
  return updatedQuestion;
}

function getQuestionDifficultyEnum() {
  const difficultyEnum = Object.values(
    questionModel.schema.path("difficulty")
  )[0];
  return difficultyEnum;
}

function getQuestionObjectiveEnum() {
  const objectiveEnum = Object.values(
    questionModel.schema.path("objective")
  )[0];
  return objectiveEnum;
}

async function getQuestionDifficultyDistribution(chapterId) {
  const questionDifficultyEnum = getQuestionDifficultyEnum();

  // Convert chapterId to ObjectId if it is not already an ObjectId
  const objectId = new mongoose.Types.ObjectId(chapterId);

  // Use aggregation to count questions for each difficulty level in one query
  // counts for example will be :[ { _id: 'simple', count: 4 }, { _id: 'difficult', count: 10 } ]
  const counts = await questionModel.aggregate([
    { $match: { chapterId: objectId } },
    { $group: { _id: "$difficulty", count: { $sum: 1 } } },
  ]);

  // Initialize the result object with default 0 counts
  const distributionObj = questionDifficultyEnum.reduce((acc, difficulty) => {
    acc[difficulty] = 0;
    return acc;
  }, {});

  counts.forEach((item) => {
    distributionObj[item._id] = item.count;
  });

  return distributionObj;
}

async function getQuestionObjectiveDistribution(chapterId) {
  const questionObjectiveEnum = getQuestionObjectiveEnum();

  // Convert chapterId to ObjectId if it is not already an ObjectId
  const objectId = new mongoose.Types.ObjectId(chapterId);

  // Use aggregation to count questions for each objective in one query
  // counts for example will be :[ { _id: 'reminding', count: 4 }, { _id: 'understanding', count: 10 }, { _id: 'creativity', count: 10 } ]
  const counts = await questionModel.aggregate([
    { $match: { chapterId: objectId } },
    { $group: { _id: "$objective", count: { $sum: 1 } } },
  ]);

  // Initialize the result object with default 0 counts
  const distributionObj = questionObjectiveEnum.reduce((acc, objective) => {
    acc[objective] = 0;
    return acc;
  }, {});

  counts.forEach((item) => {
    distributionObj[item._id] = item.count;
  });

  return distributionObj;
}

async function getQuestionsByChapterIds(chapterIds) {
  const questions = await questionModel.find({
    chapterId: { $in: chapterIds },
  });

  return questions;
}

async function getQuestionsByChapter(chapterId) {
  const questions = await questionModel.find({
    chapterId,
  });

  return questions;
}

async function getUserByEmail(email) {
  const user = await userModel.findOne({ email }).lean();
  return user;
}

async function getUserById(id) {
  const user = await userModel.findById(id).lean();
  return user;
}

async function createUser(email, passwordHash) {
  const createdUser = await userModel.create({
    email,
    passwordHash,
  });

  return createdUser;
}

async function updateUserbyId(id, updatedData) {
  const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
}

async function createVerificationCode(userId, verificationCode, expiresAt) {
  const createdVerificationCode = await verificationCodeModel.create({
    userId: userId,
    verificationCode,
    expiresAt,
  });

  return createdVerificationCode;
}

async function findVerificationCode(verificationCode) {
  const verificationCodeDocument = await verificationCodeModel
    .findOne({
      verificationCode,
      expiresAt: { $gt: Date.now() },
    })
    .lean();

  return verificationCodeDocument;
}

async function findVerificationCodesAndSort(userId) {
  const recentVerificationCodes = await verificationCodeModel
    .find({ userId })
    .sort({ createdAt: -1 });

  return recentVerificationCodes;
}

async function deleteVerificationCodesByUserId(userId) {
  await verificationCodeModel.deleteMany({ userId });
}

async function addExam(
  name,
  courseId,
  questions,
  chaptersDistribution,
  difficultyDistribution,
  objectiveDistribution
) {
  const addedExam = await examModel.create({
    name,
    courseId,
    questions,
    chaptersDistribution,
    difficultyDistribution,
    objectiveDistribution,
  });
  return addedExam;
}

async function findExamById(examId) {
  const exam = await examModel
    .findById(examId)
    .populate("course")
    .lean({ virtuals: true }); // This converts the Mongoose document into a plain JavaScript object, allowing to manipulate the result before sending it as a response.

  // I need to replace chaptersDistribution by adding each chapter with the corresponding number of question
  // Extract chapter IDs from the chaptersDistribution keys
  const chapterIds = Object.keys(exam.chaptersDistribution);

  // Query all chapter documents by their IDs
  const chapters = await findChaptersByIds(chapterIds);

  const newDisstribution = chapterIds.map((chapterId) => {
    const chapter = chapters.find((ch) => ch._id.toString() === chapterId);

    if (!chapter) {
      throw new CustomError("One of the exam chapter can't be found", 404);
    }
    
    chapter["numberOfQuestionsInExam"] = exam.chaptersDistribution[chapterId];
    return chapter;
  });

  exam.chaptersDistribution = newDisstribution;

  delete exam.questions;
  return exam;
}

async function findExams() {
  const exams = await examModel
    .find({})
    .populate("course")
    .select(
      "-chaptersDistribution -difficultyDistribution -objectiveDistribution"
    )
    .lean({ virtuals: true });
  // Remove the 'questions' field from each exam
  exams.forEach((exam) => {
    delete exam.questions;
  });
  return exams;
}

async function findExamQuestions(examId) {
  const exam = await examModel
    .findById(examId)
    .populate("questions")
    .select("questions")
    .lean(); // This converts the Mongoose document into a plain JavaScript object, allowing to manipulate the result before sending it as a response.
  return exam.questions;
}

module.exports = {
  dbConnect,
  addCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  isCourseExistsById,
  addChapter,
  getChapters,
  getChaptersByCourse,
  getChapter,
  isChapterExists,
  isChapterExistsById,
  deleteChapter,
  updateChapter,
  addQuestion,
  getNumberOfQuestion,
  getQuestions,
  getQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionDifficultyEnum,
  getQuestionObjectiveEnum,
  getQuestionDifficultyDistribution,
  getQuestionObjectiveDistribution,
  getQuestionsByChapterIds,
  getQuestionsByChapter,
  getUserByEmail,
  createUser,
  createVerificationCode,
  getUserById,
  findVerificationCode,
  updateUserbyId,
  deleteVerificationCodesByUserId,
  findVerificationCodesAndSort,
  addExam,
  findExamById,
  findExams,
  findExamQuestions,
  findChaptersByIds,
};
