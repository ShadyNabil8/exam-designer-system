const request = require("supertest");
const app = require("../index");
const database = require("../database");

jest.mock("../database");

describe("POST /api/chapters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const validCourseId = "670e7206be802b686601b307";
  const validChapterId = "60d21b4667d0d8992e610c85";
  const validChapter = {
    name: "Dynamic Programming",
    number: 5,
    maxNumberOfQuestions: 12,
    courseId: validCourseId,
  };
  it("should return 400 if the name of the chapter is empty", async () => {
    const response = await request(app)
      .post("/api/chapters")
      .send({
        ...validChapter,
        name: "",
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Chapter name is required!");
  });

  it("should return 400 if the number of the chapter isn't positive integer", async () => {
    const response = await request(app)
      .post("/api/chapters")
      .send({
        ...validChapter,
        number: "NAN",
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "Chapter number is required and must be a valid positive integer!"
    );
  });

  it("should return 400 if the max number of questions isn't positive integer", async () => {
    const response = await request(app)
      .post("/api/chapters")
      .send({
        ...validChapter,
        maxNumberOfQuestions: "NAN",
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "Maximum number of questions is required and must be a valid positive integer!"
    );
  });

  it("should return 400 if the course id isn't MongoDB valid id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app)
      .post("/api/chapters")
      .send({
        ...validChapter,
        courseId: invalidId,
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Invalid course ID");
  });

  it("should return 400 if the course that this chapter belongs to has another chapter with the same number", async () => {
    database.isChapterExists.mockResolvedValue(true);
    database.isCourseExistsById.mockResolvedValue(true);

    const response = await request(app)
      .put(`/api/chapters/${validChapterId}`)
      .send(validChapter);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "Chapter With the same number exists!"
    );
  });

  it("should return 200 chapter is successfully added", async () => {
    const mockChapter = {
      ...validChapter,
      course: {
        _id: validCourseId,
        name: "CS50",
        numberOfChapters: 2,
      },
    };

    database.isChapterExists.mockResolvedValue(false);
    database.isCourseExistsById.mockResolvedValue(true);
    database.addChapter.mockResolvedValue(mockChapter);

    const response = await request(app)
      .post("/api/chapters")
      .send(validChapter);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      "The chapter was successfully added."
    );
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toEqual(mockChapter);
  });

  it("should handle errors and call next with an error", async () => {
    // Simulate an error in `database.addChapter`.
    const mockError = new Error("Database error");
    database.addChapter.mockRejectedValue(mockError);
    database.isChapterExists.mockResolvedValue(false);
    database.isCourseExistsById.mockResolvedValue(true);
    const response = await request(app)
      .post("/api/chapters")
      .send(validChapter);

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
        maxNumberOfQuestions: 10,
        courseId: "60d21b4667d0d8992e610c85",
      },
      {
        id: "2",
        name: "Math 101",
        number: 15,
        maxNumberOfQuestions: 15,
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

describe("GET /api/chapters/:id", () => {
  it("should return 200 and the chapter object for a valid id", async () => {
    const mockChapter = {
      id: "60d21b4667d0d8992e610c85",
      name: "CS50",
      number: 5,
      maxNumberOfQuestions: 10,
      course: {
        id: "670d2c7249825f9c3cd678bc",
        name: "CS50",
        numberOfChapters: 5,
      },
    };

    database.getChapter.mockResolvedValue(mockChapter);

    const response = await request(app).get(`/api/chapters/${mockChapter.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "The chapter was successfully fetched.",
      data: mockChapter,
    });
  });

  it("should return 400 for an invalid chapter id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app).get(`/api/chapters/${invalidId}`);

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toBe("Invalid chapter ID");
  });

  // Test case: Chapter not found in database
  it("should return 404 if the chapter is not found", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    database.getChapter.mockResolvedValue(null); // Mock no chapter found

    const response = await request(app).get(`/api/chapters/${validId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: "Chapter not found",
    });
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");
    database.getChapter.mockRejectedValue(mockError);

    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId
    const response = await request(app).get(`/api/chapters/${validId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("DELETE /api/chapters/:id", () => {
  const validCourseId = "670e7206be802b686601b307";
  const validChapterId = "60d21b4667d0d8992e610c85";
  const validChapter = {
    id: validChapterId,
    name: "Dynamic Programming",
    number: 5,
    maxNumberOfQuestions: 12,
    courseId: validCourseId,
  };
  it("should return 200 and the deleted chapter object for a valid id", async () => {
    const mockDeletedChapter = validChapter;

    database.deleteChapter.mockResolvedValue(mockDeletedChapter);

    const response = await request(app).delete(
      `/api/chapters/${mockDeletedChapter.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "The chapter was successfully deleted.",
      data: mockDeletedChapter,
    });
  });

  it("should return 400 for an invalid chapter id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app).delete(`/api/chapters/${invalidId}`);

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toBe("Invalid chapter ID");
  });

  it("should return 404 if the chapter is not found", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    database.deleteChapter.mockResolvedValue(null); // Mock no course found

    const response = await request(app).delete(`/api/chapters/${validId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: "Chapter not found",
    });
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");
    database.deleteChapter.mockRejectedValue(mockError);

    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId
    const response = await request(app).delete(`/api/chapters/${validId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("PUT /api/chapters/:id", () => {
  const validCourseId = "670e7206be802b686601b307";
  const validChapterId = "60d21b4667d0d8992e610c85";
  const validChapter = {
    id: validChapterId,
    name: "Dynamic Programming",
    number: 5,
    maxNumberOfQuestions: 12,
    courseId: validCourseId,
  };
  it("should return 200 and the updated chapter object for a valid id", async () => {
    database.isChapterExists.mockResolvedValue(false);
    database.updateChapter.mockResolvedValue(validChapter);

    const response = await request(app)
      .put(`/api/chapters/${validChapterId}`)
      .send({
        id: validChapterId,
        name: "Dynamic Programming",
        number: 5,
        maxNumberOfQuestions: 12,
        courseId: validCourseId,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Chapter updated successfully",
      data: validChapter,
    });
  });

  it("should return 400 for an invalid chapter id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app)
      .put(`/api/chapters/${invalidId}`)
      .send(validChapter);

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toBe("Invalid chapter ID");
  });

  it("should return 400 if the name of the chapter is empty", async () => {
    const response = await request(app)
      .put(`/api/chapters/${validChapterId}`)
      .send({
        ...validChapter,
        name: "",
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Chapter name is required!");
  });

  it("should return 400 if the number of the chapter is not positive intiger", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    const response = await request(app)
      .put(`/api/chapters/${validId}`)
      .send({
        ...validChapter,
        number: "NAN",
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "Chapter number is required and must be a valid positive integer!"
    );
  });

  it("should return 400 if the max number of questions is not positive intiger", async () => {
    const response = await request(app)
      .put(`/api/chapters/${validChapterId}`)
      .send({
        ...validChapter,
        maxNumberOfQuestions: "NAN",
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "Maximum number of questions is required and must be a valid positive integer!"
    );
  });

  it("should return 400 if the courseId is not valid id", async () => {
    const response = await request(app)
      .put(`/api/chapters/${validChapterId}`)
      .send({
        ...validChapter,
        courseId: "invalid-id",
      });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Invalid course ID");
  });

  it("should return 400 if the course that this chapter belongs to has another chapter with the same number", async () => {
    database.isChapterExists.mockResolvedValue(true);

    const response = await request(app)
      .put(`/api/chapters/${validChapterId}`)
      .send(validChapter);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "Chapter With the same number exists!"
    );
  });

  // Test case: Course not found in database
  it("should return 404 if the chapter is not found", async () => {
    database.isChapterExists.mockResolvedValue(false);
    database.updateChapter.mockResolvedValue(null); // Mock no course found

    const response = await request(app)
      .put(`/api/chapters/${validChapterId}`)
      .send(validChapter);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: "Chapter not found",
    });
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");

    database.isChapterExists.mockResolvedValue(false);
    database.updateChapter.mockRejectedValue(mockError);

    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId
    const response = await request(app)
      .put(`/api/chapters/${validId}`)
      .send(validChapter);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("GET /api/chapters/:id/questions", () => {
  it("should return 200 and fetch the questions for a valid chapter ID", async () => {
    const mockQuestions = [
      {
        _id: "671114f2afe0d6b3ab7eced6",
        chapterId: "671112a0afe0d6b3ab7ece99",
        text: "Which planet is known as the Red Planet?",
        choices: ["Mars", "Venus", "Jupiter"],
        correctAnswer: "Mars",
        difficulty: "simple",
        objective: "reminding",
      },
      {
        _id: "671114fcafe0d6b3ab7ecedd",
        chapterId: "671112a0afe0d6b3ab7ece99",
        text: "Who wrote 'To Kill a Mockingbird'?",
        choices: ["Harper Lee", "George Orwell", "F. Scott Fitzgerald"],
        correctAnswer: "Harper Lee",
        difficulty: "simple",
        objective: "understanding",
      },
    ];

    database.getQuestionsByChapter.mockResolvedValue(mockQuestions);

    const response = await request(app).get(
      "/api/chapters/671112a0afe0d6b3ab7ece99/questions"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "The questions was successfully fetched."
    );
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].text).toBe(
      "Which planet is known as the Red Planet?"
    );
    expect(response.body.data[1].correctAnswer).toBe("Harper Lee");
  });

  it("should return 400 when the chapter ID is invalid", async () => {
    const response = await request(app).get(
      "/api/chapters/invalid-id/questions"
    );

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Invalid chapter ID");
  });

  it("should return 500 if there is a server error", async () => {
    database.getQuestionsByChapter.mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app).get(
      "/api/chapters/671112a0afe0d6b3ab7ece99/questions"
    );

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});
