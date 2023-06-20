# Movies-Library

# Samara Movies - v1.0.0

**Author Name**: Mohamad Samara

## WRRC

![WRRC](./assets/WRRC.png)

## Overview

Movies Library is a server application that provides endpoints to retrieve movie data and handle favorite pages. It utilizes Express.js and Cors to handle HTTP requests.

## Getting Started

follow these steps:

1. Clone the repository:
2. Install the required dependencies (use npm i) :
3. Start the server (you can use alias "start" ==> [ npm start ] ):
4. Access the application endpoints on `http://localhost:3000/`

## Project Features

- **Home Page Endpoint: `/`**

      Returns movie data in JSON format.

- **Favorite Page Endpoint: `/favorite`**

      Returns a welcome message for the favorite page

- **Error Handling:**

      "Sorry, something went wrong" error (status 500) is handled by returning a JSON response with an error message

      "Page not found" error (status 404) is handled by returning a JSON response with an error message
