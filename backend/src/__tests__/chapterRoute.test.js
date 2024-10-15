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

describe("GET /api/chapters/:id", () => {
  it("should return 200 and the chapter object for a valid id", async () => {
    const mockChapter = {
      id: "60d21b4667d0d8992e610c85",
      name: "CS50",
      numberOfChapters: 5,
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
  it("should return 200 and the deleted chapter object for a valid id", async () => {
    const mockDeletedChapter = {
      id: "60d21b4667d0d8992e610c85",
      name: "Dynamic Programming",
      number: 5,
      courseId: "60d21b4667d0d8992e610c85",
    };

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

  // Test case: Course not found in database
  it("should return 404 if the course is not found", async () => {
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
  it("should return 200 and the updated chapter object for a valid id", async () => {
    const mockUpdatedChapter = {
      id: "60d21b4667d0d8992e610c85",
      name: "New CS50",
      numberOfChapters: 10,
      courseId: "60d21b4667d0d8992e610c85",
    };

    database.isChapterExists.mockResolvedValue(false);
    database.updateChapter.mockResolvedValue(mockUpdatedChapter);

    const response = await request(app)
      .put(`/api/chapters/${mockUpdatedChapter.id}`)
      .send({
        id: "60d21b4667d0d8992e610c85",
        name: "New CS50",
        number: 10,
        courseId: "60d21b4667d0d8992e610c85",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Chapter updated successfully",
      data: mockUpdatedChapter,
    });
  });

  it("should return 400 for an invalid chapter id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app).put(`/api/chapters/${invalidId}`).send({
      name: "Dynamic Programming",
      number: 10,
      courseId: "60d21b4667d0d8992e610c85",
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toBe("Invalid chapter ID");
  });

  it("should return 400 if the name of the chapter is empty", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    const response = await request(app).put(`/api/chapters/${validId}`).send({
      name: "",
      number: 10,
      courseId: "60d21b4667d0d8992e610c85",
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Chapter name is required!");
  });

  it("should return 400 if the number of the chapter is not positive intiger", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    const response = await request(app).put(`/api/chapters/${validId}`).send({
      name: "Dynamic Programming",
      number: "n",
      courseId: "60d21b4667d0d8992e610c85",
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "Chapter number is required and must be a valid positive integer!"
    );
  });

  it("should return 400 if the number of the courseId is not valid id", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    const response = await request(app).put(`/api/chapters/${validId}`).send({
      name: "Dynamic Programming",
      number: 10,
      courseId: "invalid-id",
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Invalid course ID");
  });

  it("should return 400 if the course that this chapter belongs to has another chapter with the same number", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    database.isChapterExists.mockResolvedValue(true);

    const response = await request(app).put(`/api/chapters/${validId}`).send({
      name: "Dynamic Programming",
      number: 10,
      courseId: "60d21b4667d0d8992e610c85",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "Chapter With the same number exists!"
    );
  });

  // Test case: Course not found in database
  it("should return 404 if the chapter is not found", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    database.isChapterExists.mockResolvedValue(false);
    database.updateChapter.mockResolvedValue(null); // Mock no course found

    const response = await request(app).put(`/api/chapters/${validId}`).send({
      name: "Dynamic Programming",
      number: 10,
      courseId: "60d21b4667d0d8992e610c85",
    });

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
    const response = await request(app).put(`/api/chapters/${validId}`).send({
      name: "Dynamic Programming",
      number: 10,
      courseId: "60d21b4667d0d8992e610c85",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});
