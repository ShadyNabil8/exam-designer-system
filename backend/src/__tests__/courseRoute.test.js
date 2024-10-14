const request = require("supertest");
const app = require("../index");
const database = require("../database");

jest.mock("../database");

describe("POST /courses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if the name of the course is empty", async () => {
    const response = await request(app).post("/api/courses").send({
      name: "",
      numberOfChapters: 5,
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual("Course name is required!");
  });

  it("should return 400 if the number of courses isn't positive integer", async () => {
    const response = await request(app).post("/api/courses").send({
      name: "CS50",
      numberOfChapters: "n",
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors[0].msg).toEqual(
      "Number of Chapters is required and must be a valid positive integer!"
    );
  });

  it("should return 200 course is successfully added", async () => {
    // Mocking the addedCourse object
    const mockCourse = {
      id: "mockId",
      name: "CS50",
      numberOfChapters: 5,
    };

    database.addCourse.mockResolvedValue(mockCourse);

    const response = await request(app).post("/api/courses").send({
      name: "CS50",
      numberOfChapters: 5,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("The course was successfully added.");

    expect(response.body).toHaveProperty("addedCourse");
    expect(response.body.addedCourse).toEqual(mockCourse);
  });

  it("should handle errors and call next with an error", async () => {
    // Simulate an error in `database.addCourse`.
    const mockError = new Error("Database error");
    database.addCourse.mockRejectedValue(mockError);

    const response = await request(app).post("/api/courses").send({
      name: "CS50",
      numberOfChapters: 5,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("GET /api/courses", () => {
  it("should return a list of courses", async () => {
    const mockCourses = [
      { id: "1", name: "CS50", numberOfChapters: 5 },
      { id: "2", name: "Math 101", numberOfChapters: 3 },
    ];

    database.getCourses.mockResolvedValue(mockCourses);

    const response = await request(app).get("/api/courses");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ data: mockCourses });
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");
    database.getCourses.mockRejectedValue(mockError);

    const response = await request(app).get("/api/courses");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});

describe("GET /api/courses/:id", () => {
  it("should return 200 and the course object for a valid id", async () => {
    const mockCourse = {
      id: "60d21b4667d0d8992e610c85",
      name: "CS50",
      numberOfChapters: 5,
    };

    database.getCourse.mockResolvedValue(mockCourse);

    const response = await request(app).get(`/api/courses/${mockCourse.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "The course was successfully fetched.",
      data: mockCourse,
    });
  });

  it("should return 400 for an invalid course id", async () => {
    const invalidId = "invalid-id";

    const response = await request(app).get(`/api/courses/${invalidId}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Invalid course ID");
  });

  // Test case: Course not found in database
  it("should return 404 if the course is not found", async () => {
    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId

    database.getCourse.mockResolvedValue(null); // Mock no course found

    const response = await request(app).get(`/api/courses/${validId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: "Course not found",
    });
  });

  it("should handle errors from the database", async () => {
    const mockError = new Error("Database error");
    database.getCourse.mockRejectedValue(mockError);

    const validId = "60d21b4667d0d8992e610c85"; // Use a valid MongoDB ObjectId
    const response = await request(app).get(`/api/courses/${validId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  });
});
