# Local Kafka Demo Server & Services Instructions

The setup requires that docker and docker-compose be installed.

## Demo Kafka Server

The Kafka server is configured with 1 Zookeeper and 3 brokers, to create and spin it up:

`npm run demo-kafka`

---

## Demo Services

Once the Kafka server is running, the demo producers and consumers can be ran:

`npm run demo-services`

The current structure of the demo services:

Topics

- Unfulfilled orders
- Inventory
- Payments
- FulFilled orders

Services

- User service (produces to unfulfilled orders, subscribed to fulfilled orders)
- Inventory Service (subscribed to unfulfilled orders, produces to inventory)
- Payment Processing Service (subscribed to unfulfilled orders, produces to payments)
- Shipping Service (subscribed to inventory & payments, produces to fulfilled orders)
- Finance service (subscribed to payments)

---

## Reset Kafka Server

Remove the Kafka instance with:

`npm run demo-kafka-reset`
