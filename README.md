# Exam Question Generator

This project is a backend system for generating exams based on teacher-defined constraints using genetic algorithms. It allows teachers to specify the number of questions from each chapter, difficulty levels, and educational objectives, and it generates an optimized set of questions that meet those constraints.

## Features

- **Genetic Algorithm**: Utilizes a genetic algorithm to optimize question selection based on various criteria (chapter, difficulty, and objective).
- **Question Management**: Add and retrieve questions by chapters, difficulty, and objectives.
- **Exam Generation**: Generates an optimal set of questions for the exam.
- **API Documentation**: Swagger integrated for easy API testing and documentation.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: Database for storing questions, chapters, and exams.
- **Genetic Algorithm**: Optimizes the selection of questions.
- **Swagger**: API documentation and testing interface.
- **Jest**: For unit and integration testing.

## Running Tests

The project includes unit and integration tests using Jest. To run the tests, use:

```bash
npm test
```
