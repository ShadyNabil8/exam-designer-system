const request = require("supertest");
const app = require("../index");
const database = require("../database");

jest.mock("../database");

describe("POST /api/exams/generate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate the exam successfully with valid input", async () => {
    const mockQuestions = [{ questionId: "1" }, { questionId: "2" }];

    database.getQuestionsByChapterIds.mockResolvedValue(mockQuestions);

    const response = await request(app)
      .post("/api/exams/generate")
      .send({
        chapters: { chapter1: 10, chapter2: 5 },
        difficulty: { simple: 10, difficult: 5 },
        objective: { reminding: 5, understanding: 5, creativity: 5 },
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Exam successfully found");
    expect(response.body.data).toBeDefined();
  });

  it("should return 400 when chapters field is missing", async () => {
    const response = await request(app)
      .post("/api/exams/generate")
      .send({
        difficulty: { simple: 5, difficult: 5 },
        objective: { reminding: 3, understanding: 5, creativity: 2 },
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("No chapters provided");
  });

  it("should return 400 when chapters field is empty", async () => {
    const response = await request(app)
      .post("/api/exams/generate")
      .send({
        chapters: {},
        difficulty: { simple: 5, difficult: 5 },
        objective: { reminding: 3, understanding: 5, creativity: 2 },
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "You must provide at least one chapter."
    );
  });

  it("should return 400 for invalid difficulty data (non-numeric)", async () => {
    const response = await request(app)
      .post("/api/exams/generate")
      .send({
        chapters: { chapter1: 10 },
        difficulty: { simple: "five", difficult: 5 },
        objective: { reminding: 3, understanding: 5, creativity: 2 },
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "The number of questions for difficulty must be a valid number"
    );
  });

  it("should return 400 for invalid objective data (negative number)", async () => {
    const response = await request(app)
      .post("/api/exams/generate")
      .send({
        chapters: { chapter1: 10 },
        difficulty: { simple: 5, difficult: 5 },
        objective: { reminding: -3, understanding: 5, creativity: 2 },
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "The number of objective  must be a valid number"
    );
  });

  // No questions in the pool
  it("should return 400 if no questions are found in the question pool", async () => {
    database.getQuestionsByChapterIds.mockResolvedValue([]);

    const response = await request(app)
      .post("/api/exams/generate")
      .send({
        chapters: { chapter1: 10, chapter2: 5 },
        difficulty: { simple: 5, difficult: 5 },
        objective: { reminding: 3, understanding: 5, creativity: 2 },
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "There is no any question to make an exam!"
    );
  });

  it("should return 400 for invalid number of questions in chapters (NaN)", async () => {
    const response = await request(app)
      .post("/api/exams/generate")
      .send({
        chapters: { chapter1: "ten" }, // Invalid: 'ten' is not a number
        difficulty: { simple: 5, difficult: 5 },
        objective: { reminding: 3, understanding: 5, creativity: 2 },
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "The number of questions for chapters must be a valid number and greater than or equal to 1."
    );
  });
});
