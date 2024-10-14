const request = require("supertest");
const app = require("../index");
const database = require("../database");

jest.mock("../database");

describe("POST /api/chapters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if the name of the chapter is empty", async () => {
    const validCourseId = "60d21b4667d0d8992e610c85";

    const response = await request(app).post("/api/chapters").send({
      name: "",
      number: 5,
      courseId: validCourseId,
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Chapter name is required!");
  });

  it("should return 400 if the number of the chapter isn't positive integer", async () => {
    const validCourseId = "60d21b4667d0d8992e610c85";

    const response = await request(app).post("/api/chapters").send({
      name: "Intro to CS50",
      number: "n",
      courseId: validCourseId,
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "Chapter number is required and must be a valid positive integer!"
    );
  });

  it("should return 400 if the course id isn't MongoDB valid id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app).post("/api/chapters").send({
      name: "Intro to CS50",
      number: 10,
      courseId: invalidId,
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Invalid course ID");
  });

  it("should return 200 course is successfully added", async () => {
    const mockChapter = {
      courseId: "60d21b4667d0d8992e610c85",
      name: "Intro to CS50",
      number: 5,
    };

    const mockCourse = {
      id: "60d21b4667d0d8992e610c85",
      name: "CS50",
      numberOfChapters: 5,
    };

    database.addChapter.mockResolvedValue(mockChapter);
    database.getCourse.mockResolvedValue(mockCourse);

    const response = await request(app).post("/api/chapters").send({
      courseId: "60d21b4667d0d8992e610c85",
      name: "Intro to CS50",
      number: 5,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      "The chapter was successfully added."
    );
    expect(response.body).toHaveProperty("addedChapter");
    expect(response.body.addedChapter).toEqual(mockChapter);
  });

  it("should handle errors and call next with an error", async () => {
    // Simulate an error in `database.addCourse`.
    const mockError = new Error("Database error");
    database.addChapter.mockRejectedValue(mockError);

    const response = await request(app).post("/api/chapters").send({
      courseId: "60d21b4667d0d8992e610c85",
      name: "Intro to CS50",
      number: 5,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("GET /api/chapters", () => {
  it("should return a list of chapters", async () => {
    const mockChapters = [
      {
        id: "1",
        name: "Intro to CS50",
        number: 5,
        courseId: "60d21b4667d0d8992e610c85",
      },
      {
        id: "2",
        name: "Math 101",
        number: 15,
        courseId: "60d21b4667d0d8992e610c85",
      },
    ];

    database.getChapters.mockResolvedValue(mockChapters);

    const response = await request(app).get("/api/chapters");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ data: mockChapters });
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");
    database.getChapters.mockRejectedValue(mockError);

    const response = await request(app).get("/api/chapters");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});
