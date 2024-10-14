const request = require("supertest");
const app = require("../index");

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
});
