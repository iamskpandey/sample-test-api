# Sample Tracking API

Sample Tracking is the core backend service for a sample logistics platform, designed to manage the lifecycle of biological sample collection between hospitals, labs, and collection agents. This API provides a secure, scalable, and robust foundation for the system.

## Features

  * **Authentication**: Secure agent registration and login using JWT (JSON Web Tokens).
  * **Sample Management**:
      * Add new samples to the system.
      * Fetch all samples assigned to a specific agent.
      * Mark a sample as collected, updating its status and timestamping the action.
  * **Logistics Management**:
      * Report a delay for a sample pickup with a specific reason.

-----

## Tech Stack & Design Decisions

This project was built with a professional, production-ready architecture in mind.

  * **Backend**: Node.js, Express.js
  * **Database**: MongoDB with Mongoose ODM
  * **Language**: TypeScript
  * **Authentication**: JSON Web Tokens (JWT)
  * **Key Libraries**: `bcryptjs` for password hashing, `dotenv` for environment management.

### Architectural Decisions

1.  **Layered Architecture (Service-Controller-Route)**: We intentionally separated concerns to enhance maintainability and scalability.

      * **Routes**: Define the API endpoints.
      * **Controllers**: Handle the HTTP request/response cycle.
      * **Services**: Contain the core business logic and database interactions.
        This pattern keeps the code clean, organized, and easy to test.

2.  **TypeScript Over JavaScript**: TypeScript was chosen for its static typing, which helps catch errors during development, improves code quality, and provides a superior developer experience with autocompletion and self-documenting code.

3.  **Stateless JWT Authentication**: JWTs provide a secure and scalable way to protect API routes without needing to maintain session state on the server. The `protect` middleware acts as a centralized guard for all protected endpoints.

4.  **Mongoose Schema Design**: The database schemas for `Sample`, `Agent`, and `Hospital` were designed with clear relationships (`ref`), validation rules (`required`, `enum`), and security best practices (password hashing via a `pre-save` hook, default password field deselection).

-----

## Getting Started

### Prerequisites

  * Node.js (v18 or higher)
  * A MongoDB database instance (local or cloud-based like MongoDB Atlas)

### 1\. Clone the Repository

```bash
git clone <your-repository-url>
cd sample-test-api
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Set Up Environment Variables

Create a `.env` file in the root of the project. Copy the contents of `.env.example` into it and fill in your specific values.

`.env.example`:

```
# Server Port
PORT=5001

# Your MongoDB Connection String
MONGO_URI=mongodb+srv://...

# A long, random, and secret string for signing JWTs
JWT_SECRET=yourSuperSecretAndLongKeyGoesHere
```

### 4\. Run the Development Server

```bash
npm run dev
```

The API will now be running on `http://localhost:5001`.

-----

## API Endpoints

The base URL for all routes is `/api`.

### Authentication

| Method | Endpoint          | Access  | Description                      |
| :----- | :---------------- | :------ | :------------------------------- |
| `POST` | `/auth/register`  | Public  | Register a new collection agent. |
| `POST` | `/auth/login`     | Public  | Log in an agent to get a token.  |

### Samples

*All sample routes are protected and require a `Bearer Token` in the Authorization header.*

| Method  | Endpoint                      | Access    | Description                                   |
| :------ | :---------------------------- | :-------- | :-------------------------------------------- |
| `POST`   | `/samples`                    | Protected | Add a new sample to be collected.             |
| `GET`    | `/samples/agent/:agentId`     | Protected | Fetch all samples assigned to a given agent.  |
| `PATCH`  | `/samples/:sampleId/collect`  | Protected | Mark a specific sample as collected.          |
| `POST`   | `/samples/:sampleId/delay`    | Protected | Report a delay for a specific sample.         |