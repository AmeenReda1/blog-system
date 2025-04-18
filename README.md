<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Simple Blog System

This is a simple blog system built using the [NestJS](https://nestjs.com) framework. It provides a RESTful API for managing blog posts and tags, with features such as user authentication and role-based access control.

**Note**: A separate table for tags is used to improve database performance when querying the blogs table.

## Project Setup

To get started with this application, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/AmeenReda1/blog-system.git
   cd blog-system
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
     yarn run start:dev
     ```
   - Alternatively, run the application using Docker:
     ```bash
     docker compose up
     ```

## API Documentation

- Access the Swagger UI for API documentation at [http://localhost:3000/api](http://localhost:3000/api).
- If you prefer using Postman, you can access the Postman collection [here](https://www.postman.com/ameenreda1/workspace/ameen-public-workspace/collection/36546510-74308eff-40a6-4dcb-aa09-e2963d5227a1?action=share&creator=36546510).

## Application APIs

### Authentication

- **Register**: `POST http://localhost:3000/auth/register`
- **Login**: `POST http://localhost:3000/auth/login`

### Blog

- **Create Blog**: `POST http://localhost:3000/blogs/create`
- **Update Blog**: `POST http://localhost:3000/blogs/update/:id`
- **Get All Blogs**: `GET http://localhost:3000/blogs/`
- **Get Blog by ID**: `GET http://localhost:3000/blogs/:id`
- **Delete Blog**: `DELETE http://localhost:3000/blogs/:id` (allowed for admin only)

### Tags

- **Create Tag**: `POST http://localhost:3000/blogs/tags`

## Technologies Used

- **Redis**: Used for caching to improve performance.
- **Jest**: Utilized for unit testing to ensure code quality.
- **PostgreSQL**: The primary database for storing application data.

## Running Tests

- **Unit Tests**:
  ```bash
  yarn run test
  ```

## Comments

Feel free to explore the code and provide any feedback or suggestions. This project is a simple implementation of a blog system, and contributions are welcome.

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
