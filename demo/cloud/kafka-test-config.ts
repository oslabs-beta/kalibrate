import * as dotenv from 'dotenv';
dotenv.config();

interface KAFKA_TEST_CONFIG {
  clientId: string;
  brokers: string[];
  ssl: boolean;
  sasl: {
    mechanism: 'plain';
    username: string;
    password: string;
  };
}

// Pass this as an argument to new Kafka()
// to connect to test Confluent Cloud cluster
const KAFKA_TEST_CONFIG: KAFKA_TEST_CONFIG = {
  clientId: 'example',
  brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_TEST_CONFIG_USERNAME || 'username',
    password: process.env.KAFKA_TEST_CONFIG_PASSWORD || 'password',
  },
};

export default KAFKA_TEST_CONFIG;
