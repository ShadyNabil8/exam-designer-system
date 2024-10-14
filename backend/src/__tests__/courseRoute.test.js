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
