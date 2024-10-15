const request = require("supertest");
const app = require("../index");
const database = require("../database");

jest.mock("../database");

describe("POST /api/questions", () => {
  const validQuestion = {
    chapterId: "60d21b4667d0d8992e610c85",
    text: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin"],
    correctAnswer: "Paris",
    difficulty: "simple",
    objective: "reminding",
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

  it("should return 400 if the chapter reached the limit of questions", async () => {
    database.getNumberOfQuestion.mockResolvedValue(13);
    database.isChapterExistsById.mockResolvedValue(true);

    const response = await request(app)
      .post("/api/questions")
      .send(validQuestion);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "This chapter reached the limit for the number of questions"
    );
  });

  it("should return 404 if the chapter not found", async () => {
    database.getNumberOfQuestion.mockResolvedValue(1);
    database.isChapterExistsById.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/questions")
      .send(validQuestion);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Chapter not found!");
  });

  it("should return 201 and create a new question if valid data is provided", async () => {
    database.getNumberOfQuestion.mockResolvedValue(2); // Below the limit
    database.isChapterExistsById.mockResolvedValue(true);

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
