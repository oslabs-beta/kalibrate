import ip from 'ip';
import {Kafka} from 'kafkajs';

const host = process.env.HOST_IP || ip.address();

// connect to a Kafka cluster instance
const kafka = new Kafka({
  clientId: 'dev-app',
  brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
});

export default kafka;