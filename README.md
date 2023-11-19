# Express.js + TypeScript + Prisma + PostrgeSQL + Google APIs

This application constitutes a prototype intended for the development of a server-side application using technologies such as Express.js, TypeScript, Prisma, PostgreSQL and Google APIs. The primary objective is to establish a server that serves the client application by providing methods to retrieve information from the database.
The sole purpose of the database is to record and authenticate users, with a single table dedicated to them in the database.

These constitute the procedural steps required to perform the cloning of the project and its initiation:
- Create a docker image by running this command: ```docker run --name **DATABASE_USER** --publish 5432:5432 --env POSTGRES_PASSWORD=**DATABASE_PASSWORD** --detach postgres:15.2-bullseye```
- Create a ```.env``` file based on ```.env.example``` and change **DATABASE_USER**, **DATABASE_PASSWORD** and **DATABASE_NAME**
- Open a database tool (e.g. DBeaver) and create a localhost connection and a database called **DATABASE_NAME**
- Execute ```npm i``` to install the packages.
- Execute ```npx prisma migrate deploy``` to apply migrations to the database.
- Execute ```npm run dev``` in the terminal to initiate the application.

## Main implemented routes
- ```http://localhost:3000/auth/login``` - This route is designed to authenticate the user based on the parameters received in the request;
- ```http://localhost:3000/auth/register``` - This route is designed to register the user based on the parameters received in the request;
- ```http://localhost:3000/auth/check``` - This route is intended to verify the user's token when they refresh the page or enter the application, provided that a token is stored in the local storage;
- ```http://localhost:3000/company``` - **PROTECTED BY MIDDLEWARE** - This route receives in the request body an object containing identification data for a specific company. It returns the response to the client;
- ```http://localhost:3000/reviews/:companyName``` - **PROTECTED BY MIDDLEWARE** - This route takes the company name as input, which is then used to perform a search using Google APIs with an access key. Subsequently, it makes another request to the same API, this time using the company's ID, to obtain a list of reviews.

## ENV example
PORT = <br/>
DATABASE_URL= <br/>
TOKEN_SECRET = <br/> <br/>

VERIDION_API_KEY = <br/>
CHAT_GPT_API_KEY = <br/>
GOOGLE_API_KEY = <br/>

## Unfinished Work
- The Google API returns a maximum of 5 reviews, and due to time constraints, I couldn't spend more time investigating the issue.
- Technical debt - The code requires restructuring. The routes need to be organized into categories.
