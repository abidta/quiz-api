
# Quiz API

This is a simple Quiz API application built with Node.js, Express, TypeScript, Mongoose, and Zod. This API allows users to sign up, log in, create quizzes, submit answers, and view quiz results.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Models](#models)
- [API Endpoints](#api-endpoints)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/quiz-api.git
   cd quiz-api
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=port_no #default is 3000
   ```

4. Create `swagger` Api doc:
   ```sh
   npm run swagger
   ```
   
5. Start the development server:
   ```sh
   npm run dev
   ```
6. Go to `http://localhost:3000/docs` for swagger docs

## Usage

- The API is now running on `http://localhost:3000`.
- Use tools like Hoppscotch or cURL to interact with the API.

## Models

### User

```typescript
interface IUser {
  username: string;
  password: string;
}
```

### Quiz

```typescript
interface IOption {
  text: string;
  isCorrect: boolean;
}

interface IQuestion {
  question: string;
  options: IOption[];
}

interface IQuiz {
  title: string;
  description?: string;
  questions: IQuestion[];
}
```

### Quiz Result

```typescript
interface IUserQuizResult {
  userId: string;
  quizzes: {
    quizId: string;
    scorePercentage: number;
    completed: number;
    failed: number;
  }[];
}
```

## API Endpoints
all endpoint prefix with version no.eg. `/v1`
### User Authentication

- **Login**
  - **Endpoint**: `POST /auth/login`
  - **Description**: Authenticates a user.
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "string",
      "data":{
      "access_token": "string"
      }
    }
    ```

- **Signup**
  - **Endpoint**: `POST /auth/signup`
  - **Description**: Registers a new user.
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "string"
    }
    ```

### Quiz Management

- **Create Question**
  - **Endpoint**: `POST /quiz/create`
  - **Description**: Creates a new quiz question.
  - **Request Body**:
    ```json
    {
      "title": "string",
      "description": "string",
      "questions": [
        {
          "question": "string",
          "options": [
            {
              "text": "string",
              "isCorrect": true
            }
          ]
        }
      ]
    }
    ```
  - **Response**:
    ```json
    {
      "message": "string",
      "quiz": "object"
    }
    ```

### Quiz Interaction

- **Submit Answer**
  - **Endpoint**: `POST /quiz/submit`
  - **Description**: Submits answers for a quiz.
  - **Request Body**:
    ```json
    {
      "quizId": "string",
      "questions": [
        {
          "id": "string",
          "selected": "string"
        }
      ]
    }
    ```
  - **Response**:
    ```json
    {
      "message": "string",
    }
    ```

### Quiz Results

- **Get Quiz Result**
  - **Endpoint**: `GET /quiz/results?id`
  - **Description**: Retrieves quiz results for the authenticated user.if no `id` provided in query. fetching all resultd
  - **Response**:
    ```json
    
      [
        {
          "quizId": "string",
          "scorePercentage": 80,
          "completed": 10,
          "failed": 2
        }
      ]
    
    ```

- **Get Quiz Overall Score**
  - **Endpoint**: `GET /quiz/results/overall_score`
  - **Description**: Retrieves quiz overall score for the authenticated user.
  - **Response**:
    ```json
    {
      "totalScore":45.86
    }
    ```



### Quizzes

- **Get All Quizzes**
  - **Endpoint**: `GET /quiz`
  - **Description**: Retrieves all quizzes.
  - **Response**:
    ```json
    {
       [
        {
          "title": "string",
          "description": "string",
          "questions": [
            {
              "question": "string",
              "options": [
                {
                  "text": "string",
                  "isCorrect": "boolean"
                }
              ]
            }
          ]
        }
    //... another quiz
      ]
    }
    ```

- **Get Quiz by ID**
  - **Endpoint**: `GET /quiz/:id`
  - **Description**: Retrieves a quiz by its ID.
  - **Response**:
    ```json
    
       {
        "title": "string",
        "description": "string",
        "questions": [
          {
            "question": "string",
            "options": [
              {
                "text": "string",
                "isCorrect": "boolean"
              }
            ]
          }
        ]
      }
  
    ```

## License

This project is licensed under the MIT License.
