# Kalibrate

<p align="center">
  <img src="src/client/assets/crow2.png?raw=true" width="225px">
</p>

<h3 align="center">A free and open-source web application for managing and monitoring Kafka clusters</h3>

<br />

## Table of Contents

- [About](#about)
- [Running Kalibrate in a Local Environment](#running-kalibrate-in-a-local-environment)
  - [Initialization](#initialization)
  - [Production](#production)
  - [Development](#development)
  - [Testing](#testing)
- [Running Kalibrate with Docker](#running-kalibrate-with-docker)
  - [Production](#production)
  - [Development](#development)
  - [Reset Docker Environment](#reset-docker-environment)
- [Environment Variables](#environment-variables)
- [Demo Kafka Cluster & Services](#demo-kafka-cluster-&-services)
  - [Running Demo Cluster](#running-demo-cluster)
  - [Running Demo Services](#running-demo-services)
  - [Reset the Cluster](#reset-the-cluster)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

---

## About

Kalibrate is an all-in-one, free and open source tool to make managing and monitoring your Apache
Kafka clusters a breeze. It's easy to set up and provides a friendly user experience. Simply login
or create an account, then connect to your Kafka instances to get started.

<p align="center">
  <img src="./readme-assets/connect.gif?raw=true" width='75%'>
</p>

With Kalibrate, you can save a Kafka cluster to your account by giving it a unique name and
entering a valid URI along with SASL credentials if applicable. Add new clients to your account at
any time, or remove one by selecting one of your saved clients and clicking delete.

Once connected to a Kafka cluster, you'll be greeted with an high level overview of its metadata and
health. Head on over to the options within the manage tab to view and configure brokers, topics,
partitions, messages, and consumer groups and members. Navigate to the monitor options to get a live
and dynamically graphed view of your cluster throughput and offsets.

<p align="center">
  <img src="./readme-assets/manage.gif?raw=true" width='75%'>
</p>

Kalibrate was developed with ease of use and configurability in mind. The application features a light
and dark mode, user account configuration options, and an alert system that provides in-app notifications,
with Slack and email integrations.

Security was a top priority in Kalibrate's developement. User account information and
Kafka cluster credentials are securely stored through a combination of hashing, symmetric
encryption, and careful session management.

<p align="center">
  <img src="./readme-assets/configure.gif?raw=true" width='75%'>
</p>

Get started with Kalibrate by visiting our [website](https://www.kalibratelabs.io/), or read on to learn
how to run Kafka in your local environment. If you're interested in learning more about our
intentions, you can check out our [launch article](https://medium.com/@kalibratelabs/demystifying-apache-kafka-with-kalibrate-ab9fc2e03ea), and be sure to get the latest on Kalibrate by following us on
[LinkedIn](https://www.linkedin.com/company/kalibratelabs) and
[Twitter](https://twitter.com/KalibrateLabs).

---

## Running Kalibrate in a Local Environment

### Initialization

Run `npm install` to install dependencies, followed by `npx prisma migrate dev --name init` to map
the Prisma Data Model to your database schema, and `prisma generate` to generate the Prisma Client.
Finally, the database can be initialized with necessary records by running
`node scripts/init-dv.js`.

### Production

Run `npm run build`, followed by `npm start`. By default, the server will listen on port 5173 and
the application will be accessible on `localhost:5173` in your browser.

### Development

Run `npm run dev`. An HMR enabled dev server will listen on port 5712 and the application will be
accessible on `localhost:5712` in your browser. Requests to the API will be proxied to the Express
server listening on port 5173 by default.

### Testing

Run `npm run test` to run all tests. Unit and integration tests can be found in the `__tests__`
folder.

---

## Running Kalibrate with Docker

Before you begin, be sure to have Docker and Docker Compose installed.

### Production

Run `npm install` to install dependencies, followed by `npm run build` to output the production
bundles to the `dist` folder.

Run `npx prisma migrate dev --name init` to map the Prisma Data Model to your database schema,
followed by `prisma generate` to generate the Prisma Client and `node scripts/init-dv.js` to
initialize the database with necessary records.

Delete the `node_modules` folder, and build the Docker image for the production environment with
`npm run docker-build-prod`. You can verify that the `kalibrate-prod` image has been created by
running `docker images`.

Create the production container with `npm run docker-prod:run`. You can verify that the container
has been created by running `docker ps`.

By default, the Express server listens on port 5173 and the application can be viewed by navigating
to `localhost:5173` in your browser.

To stop the container, run `npm run docker-prod:stop`.

For deployment, check that the `dist` folder is not in your `.gitignore` file and that any changes
to your local repository have been committed. You can then zip the application with
`git archive -v -o kalibrate.zip --format=zip HEAD`.

### Development

Build the Docker images for the development environment and PostgreSQL database with
`npm run docker-build-dev`. This creates two images, `kalibrate-dev` and `kalibrate-postgres`, which
you can verify have been created by running `docker images`.

Run the Docker Compose container with `npm run docker-dev:up`. An HMR enabled dev server will listen
on port 5712 and the application will be accessible on `localhost:5712` in your browser. Requests to
the API will be proxied to the Express server listening on port 5173 by default. Environmental
variables have been preconfigured in the Docker Compose file to connect to the local PostgreSQL
database.

Stop the container with `npm run docker-dev:down`.

### Reset Docker Environment

You can remove all Docker images and containers with `npm run docker-remove-all`.

---

## Environment Variables

The following environment variables should be set in a root `.env` file:

- `PORT`: Port for the Express server
- `DB_URI`: PostgreSQL database URI, if you are not utilizing the Docker development container
- `SHADOW_DB_URI`: For certain hosted databases, Prisma may require you to provide a shadow database
  URI
- `SALT_WORK_FACTOR`: Salt work factor for bcrypt hashing
- `JWT_SECRET`: JSON Web Token secret
- `ENCRYPT_KEY`: Symmetric encryption key
- `SENDGRID_API_KEY`: Email integrations
- `SENDGRID_EMAIL`: For Email integrations
- `SG_TEMPLATE_PASSWORD`: Email integrations
- `SG_TEMPLATE_ALERT`: Email integrations

---

## Demo Kafka Cluster & Services

Before you begin, be sure to have Docker and Docker Compose installed.

### Running Demo Cluster

The Kafka server is configured with 1 Zookeeper and 3 brokers. To create and spin it up, run
`npm run demo-kafka`.

### Running Demo Services

Once the Kafka server is running, spin up the services by running `npm run demo-services`.

These client instances create the following topics:

- Unfulfilled orders
- Inventory
- Payments
- Fulfilled orders

They interact with the cluster in the following way:

- User service: produces to unfulfilled orders, subscribed to fulfilled orders
- Inventory Service: subscribed to unfulfilled orders, produces to inventory
- Payment Processing Service: subscribed to unfulfilled orders, produces to payments
- Shipping Service: subscribed to inventory & payments, produces to fulfilled orders
- Finance Service: subscribed to payments

### Reset the Cluster

Stop and remove the Kafka server by running `npm run demo-kafka-reset`.

---

## Contributing

Interested in contributing? We encourage you to fork the repository and open a pull request.

Planned features for future versions of Kalibrate include:

- Producing messages
- Adding more cluster metrics and visualization
- Expanding available alerts and user preferences
- Persisting selected alerts and preferences
- Adding OAuth authentication
- Improving the UI
- Optimizing application performance with improved state management and caching
- Expanding development testing suite

---

## Contributors

<table align="center">
  <tr>
    <td align="center">
      <img src="readme-assets/ashleegafaru.jpeg" width="140px;" alt=""/>
      <br />
      <sub><b>Ashlee Gafaru</b></sub>
      <br />
      <a href="https://github.com/ashleegaf"><img src="readme-assets/github.png" width="20px;" alt=""/></a>
      <a href="https://www.linkedin.com/in/ashlee-gafaru/"><img src="readme-assets/linkedin.png" width="20px;" alt=""/></a>
    </td>
    <td align="center">
      <img src="readme-assets/jihuixue.jpeg" width="140px;" alt=""/>
      <br />
      <sub><b>Jihui Xue</b></sub>
      <br />
      <a href="https://github.com/jihuixue"><img src="readme-assets/github.png" width="20px;" alt=""/></a>
      <a href="https://www.linkedin.com/in/jihuixue/"><img src="readme-assets/linkedin.png" width="20px;" alt=""/></a>
    </td>
    <td align="center">
      <img src="readme-assets/jonahhammond.jpeg" width="140px;" alt=""/>
      <br />
      <sub><b>Jonah Hammond</b></sub>
      <br />
      <a href="https://github.com/jdhammond"><img src="readme-assets/github.png" width="20px;" alt=""/></a>
      <a href="https://www.linkedin.com/in/jdhammond/"><img src="readme-assets/linkedin.png" width="20px;" alt=""/></a>
    </td>
     <td align="center">
      <img src="readme-assets/juliendevlin.png" width="140px;" alt=""/>
      <br />
      <sub><b>Julien Devlin</b></sub>
      <br />
      <a href="https://github.com/juliendevlin"><img src="readme-assets/github.png" width="20px;" alt=""/></a>
      <a href="https://www.linkedin.com/in/juliendevlin/"><img src="readme-assets/linkedin.png" width="20px;" alt=""/></a>
    </td>
    <td align="center">
      <img src="readme-assets/rebeccakwong.jpeg" width="140px;" alt=""/>
      <br />
      <sub><b>Rebecca Kwong</b></sub>
      <br />
      <a href="https://github.com/rebegnowk"><img src="readme-assets/github.png" width="20px;" alt=""/></a>
      <a href="https://www.linkedin.com/in/rebeccakwong/"><img src="readme-assets/linkedin.png" width="20px;" alt=""/></a>
    </td>
  </tr>
</table>

---

## License

Kalibrate is MIT licensed.
