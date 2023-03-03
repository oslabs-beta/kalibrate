import * as dotenv from 'dotenv';
dotenv.config();

// Pass this as an argument to new Kafka()
// to connect to test Confluent Cloud cluster
const KAFKA_TEST_CONFIG = {
  clientId: 'example',
  brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_TEST_CONFIG_USERNAME,
    password: process.env.KAFKA_TEST_CONFIG_PASSWORD,
  },
};

export default KAFKA_TEST_CONFIG;
