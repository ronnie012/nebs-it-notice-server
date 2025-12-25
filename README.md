# NEBS IT - Notice Management (Server)

## Project Overview

This is the backend server for the NEBS IT Notice Management platform. It provides a serverless API for creating, reading, updating, and deleting notices. The API is built with Node.js and is designed for deployment on Vercel.

## Live Site Link (URL): https://nebs-it-notice-server.vercel.app/api


## Tech Stack

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Deployment**: [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
-   **Database**: [MongoDB](https://www.mongodb.com/) (via MongoDB Atlas)

## Installation

To run this project locally, you can use the Vercel CLI's development server.

1.  Navigate to the server directory:
    ```bash
    cd nebs-it-notice-server
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `nebs-it-notice-server` directory and add the environment variables (see below).

4.  Start the local development server:
    ```bash
    npm start
    ```
    (This command runs `vercel dev`).

The API will be available at `http://localhost:3000`.

## Environment Variables

This project requires the following environment variables to be set. For local development, create a `.env` file in the root of the server directory. For production, set these in the Vercel project's Environment Variables settings.

-   `MONGO_URI`: The full connection string for your MongoDB Atlas cluster.
-   `MONGO_DB`: The name of the database to use.

**Important**: Your `.env` file should be added to `.gitignore` and should not be committed to version control.

**Example `.env` file:**

```
MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
MONGO_DB="yourDatabaseName"
```

## API Base URL

When deployed, the API is available at `/api`.

-   **Production Base URL**: `https://<your-vercel-deployment-url>/api`
-   **Local Development Base URL**: `http://localhost:3000/api`