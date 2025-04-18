<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Simple Blog System

This is a simple blog system built using the [NestJS](https://nestjs.com) framework. It provides a RESTful API for managing blog posts and tags, with features such as user authentication and role-based access control.

## Project Setup

To get started with this application, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Environment Configuration**:

   - Copy the example environment file and configure it as needed:
     ```bash
     cp .env.example .env
     ```

3. **Run Infrastructure Services**:

   - Start the required infrastructure services using Docker:
     ```bash
     docker compose -f docker-compose.infra.yml up
     ```

4. **Run the Application**:
   - For development, use:
     ```bash
     pnpm run start:dev
     ```
   - Alternatively, run the application using Docker:
     ```bash
     docker compose up
     ```

## API Documentation

- Access the Swagger UI for API documentation at [http://localhost:3000/api](http://localhost:3000/api).
- If you prefer using Postman, request access to the Postman collection.

## Technologies Used

- **Redis**: Used for caching to improve performance.
- **Jest**: Utilized for unit testing to ensure code quality.
- **PostgreSQL**: The primary database for storing application data.

## Running Tests

- **Unit Tests**:
  ```bash
  pnpm run test
  ```
- **End-to-End Tests**:
  ```bash
  pnpm run test:e2e
  ```
- **Test Coverage**:
  ```bash
  pnpm run test:cov
  ```

## Comments

Feel free to explore the code and provide any feedback or suggestions. This project is a simple implementation of a blog system, and contributions are welcome.

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
