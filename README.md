# Project Overview

## Description

This project is a Node.js application designed to work as a backend service deployed on Firebase Cloud Functions. It
uses the Express framework to handle HTTP requests and provides APIs for task and user management.

## Features

- **Task Management API**: Supports CRUD operations for tasks, including marking tasks as completed.
- **User Management API**: Handles user authentication and account creation.
- **Middleware**:
    - CORS support for handling cross-origin requests.
    - JSON payload parsing for incoming requests.

## Technologies Used

- **Node.js** with **Express** for implementing the backend API.
- **Firebase Functions** to deploy serverless cloud functions.
- **Passport.js** (JWT strategy) for user authentication.
- **Firestore** as the database to store user and task data.

## Structure

- **Functions**: The entry point (`index.ts`) initializes the Express app and sets up routes.
- **Routes**: Defined separately for:
    - `tasks`: Includes endpoints for fetching, creating, updating, and deleting tasks.
    - `users`: Includes endpoints for user authentication and account creation.

## Setup Instructions

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Deploy the app to Firebase using `firebase deploy`.
4. Access APIs using the deployed function's URL.

## Key Dependencies

- `express`
- `firebase-functions`
- `passport`
- `jsonwebtoken`
- `uuid`

## Version Information

- **Node.js**: v16 or later.
- **TypeScript**: v5.7.3

## License

This project is licensed under the MIT License.
