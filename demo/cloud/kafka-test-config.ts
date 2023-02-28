import * as dotenv from 'dotenv';
dotenv.config();

// Pass this as an argument to new Kafka()
const KAFKA_TEST_CONFIG = {
  clientId: 'example',
  brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    // for purposes of an eventual user, look into how a granular API key might be different from a global one
    username: process.env.KAFKA_TEST_CONFIG_USERNAME,
    password: process.env.KAFKA_TEST_CONFIG_PASSWORD,
  },
};

export default KAFKA_TEST_CONFIG;
