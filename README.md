# Nest Js E-commerce Documentation

## Features

- **Basic Authentication**: Secure authentication mechanism for users.
- **Google Authentication**: Secure authentication mechanism integrated with [Google](https://console.cloud.google.com/).
- **Product Management**: Add, update, and delete products.
- **Discount Management**: Create and manage discounts for products.
- **Inventory Management**: Track and manage product inventory.
- **Order Management**: Handle customer orders, including creation, update, and status tracking.
- **Payment Gateway Integration**: Integration with [Midtrans](https://midtrans.com/) for processing payments.
- **Order Notification**: Notify customers about their order status.

## Used Packages

- [Nest Js](https://github.com/nestjs/nest): A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- [fastify](https://github.com/fastify/fastify): A fast and low overhead web framework for Node.js.
- [@nestjs/typeorm](https://github.com/nestjs/typeorm): A NestJS module for using TypeORM with Nest framework.
- [class-validator](https://github.com/typestack/class-validator): Decorator-based property validation for classes.
- [ejs](https://github.com/mde/ejs): Embedded JavaScript templating.
- [@nestjs/jwt](https://github.com/nestjs/jwt): JWT utilities for Nest framework.
- [@nestjs/swagger](https://github.com/nestjs/swagger): OpenAPI (Swagger) module for Nest framework.
- [pg](https://github.com/brianc/node-postgres): PostgreSQL client for Node.js.
- [@nestjs-modules/mailer](https://github.com/nest-modules/mailer): Mailer module for Nest framework.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js): Library to help hash passwords.
- [ioredis](https://github.com/redis/ioredis): A robust, full-featured Redis client for Node.js.

## Documentation

- [swagger](http://localhost:5000/api/docs) you can access the documentation locally when you running the app
- [ERD (Entity Relationship Diagram)](https://dbdiagram.io/d/e-commerce-6688b9169939893dae2fc1bc) database schema on db diagram

## Tech Stack

- [PostgreSQL](https://www.postgresql.org/): A powerful, open-source object-relational database system.
- [Redis](https://redis.io/): An open-source, in-memory data structure store used as a database, cache, and message broker.
- [Docker](https://www.docker.com/): A platform for developing, shipping, and running applications in containers.

## Installation

To install the necessary dependencies, run:

```bash
$ npm install
```

## Seeding

To run database seeding, run:

```bash
$ npm run db:seed
```

## Running the App

To start the application in different modes:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

To run tests, use the following commands:

```bash
# unit tests
$ npm run test

# unit tests in watch mode
$ npm run test:watch

# end-to-end (e2e) tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

To start the application using Docker, run:

```bash
$ docker compose up -d
```

This documentation provides an overview of the features, packages, tech stack, and instructions for installation, running, and testing the Nest Js E-commerce application.

## License

[MIT](LICENSE)
