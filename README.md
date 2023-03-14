# Kalibrate

A free and open-source GUI for managing and monitoring Kafka clusters.

---

## Running Kalibrate in a Local Environment

### Environment Variables

The following environment variables must be set in your root `.env` file:

- `PORT`: Port for the Express server, defaults to `5173`
- `DB_URI`: PostgreSQL database URI
- `SHADOW_DB_URI`: For certain hosted databases, Prisma may require you to provide a shadow database
  URI
- `SALT_WORK_FACTOR`: Salt work factor for bcrypt, defaults to `10`
- `JWT_SECRET`: JSON Web Token secret, defaults to `secret`
- `ENCRYPT_KEY`: Symmetric encryption key, defaults to `key`

### Initialization

Run `npm install` to install dependencies, followed by `npx prisma migrate dev --name init` to map
the Prisma Data Model to your database schema, and `prisma generate` to generate the Prisma Client.

### For Production

Run `npm run build`, followed by `npm start`. By default, the server will listen on port 5173 and
the application will be accessible on `localhost:5173` in your browser.

### For Development

Run `npm run dev`. An HMR enabled dev server will listen on port 5712 and the application will be
accessible on `localhost:5712` in your browser. Requests to the API will be proxied to the Express
server listenening on port 5173 by default.

### Testing

Run `npm run test` to run all tests. Unit and integration tests can be found in the `__tests__`
folder.

---

## Running Kalibrate with Docker

Before you begin, be sure to have Docker and Docker Compose installed.

### For Production

todo: set env vars + db initialization w/ script and prisma cmds? May need to update docker file?

Build the image for the production environemnt with: `npm run docker-build-prod`. YOu can verify
that the `kalibrate-prod` image has been created by running `docker images`

Create the production container with `npm run docker-prod:run`. You can verify that the container
has been created by running `docker ps`.

By default, the Express server listens on port 5173 and the application can be viewed by navigating
to `localhost:5173` in your browser.

To stop the container, run `npm run docker-prod:stop`.

### For Development

Build the images for the development environment and PostgreSQL database with
`npm run docker-build-dev`. This creates two images, `kalibrate-dev` and `kalibrate-postgres`, which
you can verify have been created by running `docker images`.

Run the Docker Compose container with `npm run docker-dev:up`. An HMR enabled dev server will listen
on port 5712 and the application will be accessible on `localhost:5712` in your browser. Requests to
the API will be proxied to the Express server listenening on port 5173 by default. Environmental
variables have been preconfigured in the Docker Compose file to connect to the local PostgreSQL
database.

Stop the container with `npm run docker-dev:down`.

### Reset Docker Environment

You can remove all Docker images and containers with `npm run docker-remove-all`.

---

## Demo Kafka Cluster & Services

Before you begin, be sure to have Docker and Docker Compose installed.

### Running the Demo Cluster

The Kafka server is configured with 1 Zookeeper and 3 brokers. To create and spin it up, run
`npm run demo-kafka`.

### Running Demo Services

Once the Kafka server is running, spin up the services by running `npm run demo-services`.

These client instances create the following topics:

- Unfulfilled orders
- Inventory
- Payments
- FulFilled orders

They interract with the cluster in the following way:

- User service: produces to unfulfilled orders, subscribed to fulfilled orders
- Inventory Service: subscribed to unfulfilled orders, produces to inventory
- Payment Processing Service: subscribed to unfulfilled orders, produces to payments
- Shipping Service: subscribed to inventory & payments, produces to fulfilled orders
- Finance Service: subscribed to payments

### Reset Kafka Cluster

Stop and remove the Kafka server by running `npm run demo-kafka-reset`.
