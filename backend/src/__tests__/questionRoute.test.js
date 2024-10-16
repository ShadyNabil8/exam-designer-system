const request = require("supertest");
const app = require("../index");
const database = require("../database");

jest.mock("../database");

describe("POST /api/questions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validQuestion = {
    chapterId: "60d21b4667d0d8992e610c85",
    text: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin"],
    correctAnswer: "Paris",
    difficulty: "simple",
    objective: "reminding",
  };
  const validCourseId = "670e7206be802b686601b307";
  const validChapterId = "60d21b4667d0d8992e610c85";
  const validChapter = {
    id: validChapterId,
    name: "Dynamic Programming",
    number: 5,
    maxNumberOfQuestions: 12,
    courseId: validCourseId,
    maxNumberOfEachObjective: 4,
    maxNumberOfEachDifficulty: 6,
  };

  it("should return 400 if chapterId is invalid", async () => {
    const response = await request(app)
      .post("/api/questions")
      .send({
        ...validQuestion,
        chapterId: "invalid-id",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual("Invalid chapter ID");
  });

  it("should return 400 if question text is missing", async () => {
    const response = await request(app)
      .post("/api/questions")
      .send({
        ...validQuestion,
        text: "",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual("Question text is required!");
  });

  it("should return 400 if choices array has less than 3 items", async () => {
    const response = await request(app)
      .post("/api/questions")
      .send({
        ...validQuestion,
        choices: ["Paris"],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Choices must be an array with at least 3 items."
    );
  });

  it("should return 400 if correctAnswer is not one of the choices", async () => {
    const response = await request(app)
      .post("/api/questions")
      .send({
        ...validQuestion,
        correctAnswer: "Madrid",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Correct answer must be one of the provided choices"
    );
  });

  it("should return 400 if difficulty is not valid", async () => {
    const response = await request(app)
      .post("/api/questions")
      .send({
        ...validQuestion,
        difficulty: "hard",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Difficulty must be either 'simple' or 'difficult'."
    );
  });

  it("should return 400 if objective is not valid", async () => {
    const response = await request(app)
      .post("/api/questions")
      .send({
        ...validQuestion,
        objective: "analysis",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Objective must be one of 'reminding', 'understanding', or 'creativity'."
    );
  });

  it("should return 400 if the chapter exceed the limit of questions", async () => {
    database.getNumberOfQuestion.mockResolvedValue(13); // Above the limit
    database.getChapter.mockResolvedValue(validChapter);

    const response = await request(app)
      .post("/api/questions")
      .send(validQuestion);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "This chapter reached the limit for the number of questions"
    );
  });

  it("should return 404 if the chapter not found", async () => {
    database.getNumberOfQuestion.mockResolvedValue(1); // Below the limit
    database.getChapter.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/questions")
      .send(validQuestion);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Chapter not found!");
  });

  it("should return 201 and create a new question if valid data is provided", async () => {
    database.getNumberOfQuestion.mockResolvedValue(4); // Below the limit
    database.getChapter.mockResolvedValue(validChapter);
    database.getQuestionDifficultyDistribution.mockResolvedValue({
      simple: 2,
      difficult: 6,
    });
    database.getQuestionObjectiveDistribution.mockResolvedValue({
      reminding: 0,
      understanding: 4,
      creativity: 4,
    });

    database.addQuestion.mockResolvedValue({
      _id: "60d21b4667d0d8992e610c90",
      ...validQuestion,
    });

    const response = await request(app)
      .post("/api/questions")
      .send(validQuestion);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual("Question added successfully.");
    expect(response.body.data.text).toEqual(validQuestion.text);
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");
    database.addQuestion.mockRejectedValue(mockError);

    const response = await request(app)
      .post("/api/questions")
      .send(validQuestion);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("GET /api/questions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and a list of questions", async () => {
    const mockQuestions = [
      {
        _id: "60d21b4667d0d8992e610c90",
        text: "What is the capital of France?",
        choices: ["Paris", "London", "Berlin"],
        correctAnswer: "Paris",
        difficulty: "simple",
        objective: "reminding",
        chapterId: "60d21b4667d0d8992e610c85",
      },
      {
        _id: "60d21b4667d0d8992e610c91",
        text: "What is 2 + 2?",
        choices: ["3", "4", "5"],
        correctAnswer: "4",
        difficulty: "simple",
        objective: "understanding",
        chapterId: "60d21b4667d0d8992e610c86",
      },
    ];

    database.getQuestions.mockResolvedValue(mockQuestions);

    const response = await request(app).get("/api/questions");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(mockQuestions);
    expect(response.body.data.length).toBe(2); // Ensure the length is 2
  });

  it("should return 200 with an empty list when no questions exist", async () => {
    database.getQuestions.mockResolvedValue([]);

    const response = await request(app).get("/api/questions");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual([]);
    expect(response.body.data.length).toBe(0);
  });

  it("should return 500 if there is a server error", async () => {
    database.getQuestions.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/questions");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toEqual("Database error"); // Standard error message for server errors
  });
});

describe("GET /api/questions/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the question object for a valid id", async () => {
    const mockQuestion = {
      _id: "670e7caf911a126cb71ea37d",
      chapterId: "670e790b7ba09c93577312ae",
      text: "What is the capital of France?",
      choices: ["Paris", "London", "Berlin"],
      correctAnswer: "Paris",
      difficulty: "simple",
      objective: "reminding",
      chapter: {
        _id: "670e790b7ba09c93577312ae",
        courseId: "670e78f77ba09c93577312a9",
        name: "Introduction to CS50",
        number: 1,
        maxNumberOfQuestions: 5,
        course: {
          _id: "670e78f77ba09c93577312a9",
          name: "CS50",
          numberOfChapters: 1,
        },
      },
    };

    database.getQuestion.mockResolvedValue(mockQuestion);

    const response = await request(app).get(
      `/api/questions/${mockQuestion._id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "The question was successfully fetched.",
      data: mockQuestion,
    });
  });

  it("should return 400 for an invalid question id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app).get(`/api/questions/${invalidId}`);

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toBe("Invalid question ID");
  });

  it("should return 404 if the question is not found", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    database.getQuestion.mockResolvedValue(null); // Mock no chapter found

    const response = await request(app).get(`/api/questions/${validId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: "Question not found",
    });
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");
    database.getQuestion.mockRejectedValue(mockError);

    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId
    const response = await request(app).get(`/api/questions/${validId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("DELETE /api/questions/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if question ID is invalid", async () => {
    const response = await request(app)
      .delete("/api/questions/invalid-id") // Invalid MongoDB ObjectId
      .send();

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual("Invalid question ID");
  });

  it("should return 404 if question is not found", async () => {
    database.deleteQuestion.mockResolvedValue(null);

    const response = await request(app)
      .delete("/api/questions/60d21b4667d0d8992e610c85")
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Question not found");
  });

  it("should return 200 and delete the question successfully", async () => {
    const mockDeletedQuestion = {
      _id: "60d21b4667d0d8992e610c85",
      text: "What is the capital of France?",
      choices: ["Paris", "London", "Berlin"],
      correctAnswer: "Paris",
      difficulty: "simple",
      objective: "reminding",
      chapterId: "60d21b4667d0d8992e610c80",
    };

    database.deleteQuestion.mockResolvedValue(mockDeletedQuestion);

    const response = await request(app)
      .delete("/api/questions/60d21b4667d0d8992e610c85")
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      "The question was successfully deleted."
    );
    expect(response.body.data).toEqual(mockDeletedQuestion);
  });

  it("should return 500 if there is a server error", async () => {
    database.deleteQuestion.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .delete("/api/questions/60d21b4667d0d8992e610c85")
      .send();

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toEqual("Database error");
  });
});

describe("PUT /api/questions/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validQuestion = {
    chapterId: "60d21b4667d0d8992e610c85",
    text: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin"],
    correctAnswer: "Paris",
    difficulty: "simple",
    objective: "reminding",
  };

  it("should return 400 if question ID is invalid", async () => {
    const response = await request(app)
      .put("/api/questions/invalid-id")
      .send(validQuestion);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual("Invalid question ID");
  });

  it("should return 400 if chapterId is invalid", async () => {
    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send({ ...validQuestion, chapterId: "invalid-id" });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual("Invalid chapter ID");
  });

  it("should return 400 if text is missing", async () => {
    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send({ ...validQuestion, text: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual("Question text is required!");
  });

  it("should return 400 if choices do not contain exactly 3 items", async () => {
    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send({ ...validQuestion, choices: ["Paris", "London"] });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Choices must be an array with at least 3 items."
    );
  });

  it("should return 400 if correctAnswer is not one of the choices", async () => {
    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send({ ...validQuestion, correctAnswer: "Madrid" });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Correct answer must be one of the provided choices"
    );
  });

  it("should return 400 if difficulty is not valid", async () => {
    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send({ ...validQuestion, difficulty: "hard" });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Difficulty must be either 'simple' or 'difficult'."
    );
  });

  it("should return 400 if objective is not valid", async () => {
    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send({ ...validQuestion, objective: "analysis" });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual(
      "Objective must be one of 'reminding', 'understanding', or 'creativity'."
    );
  });

  it("should return 404 if the question is not found", async () => {
    database.updateQuestion.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send(validQuestion);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Question not found");
  });

  it("should return 200 and update the question successfully", async () => {
    const mockUpdatedQuestion = {
      ...validQuestion,
      _id: "60d21b4667d0d8992e610c85",
    };

    database.updateQuestion.mockResolvedValue(mockUpdatedQuestion);

    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85")
      .send(validQuestion);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Chapter updated successfully");
    expect(response.body.data).toEqual(mockUpdatedQuestion);
  });

  it("should return 500 if there is a server error", async () => {
    database.updateQuestion.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .put("/api/questions/60d21b4667d0d8992e610c85") // Valid question ID
      .send(validQuestion);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toEqual("Database error");
  });
});
