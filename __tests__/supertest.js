import request from 'supertest';
import dotenv from 'dotenv';
import KAFKA_TEST_CONFIG from '../demo/cloud/kafka-test-config';

dotenv.config();

// tests only run if connected to server
// use jest --verbose to get pleasant checkmark digest of tests run

const server = `http://localhost:${process.env.PORT}`;

describe('Route integration', () => {
  describe('Connecting to Kafka', () => {
    // extend time limit because of kafka retries
    jest.setTimeout(15000);
    describe('POST', () => {
      it('connects given correct non-SASL credentials', () => {
        return request(server)
          .post('/api/connection')
          .send({
            clientId: 'cluster',
            brokers: [`${process.env.LOCAL_IP}:${process.env.DOCKER_PORT}`],
          })
          .then(res => {
            expect(res.status).toEqual(201);
          });
      });

      it('connects given correct SASL credentials', () => {
        return request(server)
          .post('/api/connection')
          .send(KAFKA_TEST_CONFIG)
          .then(res => {
            expect(res.status).toEqual(201);
          });
      });

      it('fails connection with incomplete credentials', () => {
        return request(server)
          .post('/api/connection')
          .send({clientId: 'hello', broker: []})
          .then(res => {
            expect(res.status).toEqual(403);
            expect(res.body.error);
          });
      });

      it('fails connection with incorrect credentials', () => {
        // deep clone the config object so we can create an incorrect version of it without touching the original
        const incorrectLogin = JSON.parse(JSON.stringify(KAFKA_TEST_CONFIG));
        incorrectLogin.sasl.password = 'wrong';
        return request(server)
          .post('/api/connection')
          .send(incorrectLogin)
          .then(res => {
            expect(res.status).toEqual(403);
            expect(res.body.error);
          });
      });
    });
  });

  describe('Getting data from cloud', () => {
    jest.setTimeout(60000);
    describe('GET', () => {
      // a topic that exists in cloud instance:
      const sampleTopic = 'topic_1';

      // connect to kafka before fetching data
      beforeAll(() => {
        return request(server).post('/api/connection').send(KAFKA_TEST_CONFIG);
      });

      it('gets data from get-data backend route', () => {
        return request(server)
          .get('/api/get-data')
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .then(res => {
            expect(res.body.hasOwnProperty('clusterData'));
            expect(res.body.hasOwnProperty('topicData'));
            expect(res.body.hasOwnProperty('groupData'));
            expect(res.body.hasOwnProperty('groupList'));
          });
      });

      it('gets messages from topic-messages route', () => {
        return request(server)
          .get(`/api/${sampleTopic}/messages`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .then(res => {
            expect(res.body.hasOwnProperty('topicMessages'));
          });
      });

      it('fails to get messages if nonexistent topic is provided', () => {
        return request(server).get(`/api/faketopicfaketopic/messages`).expect(400);
      });
    });
  });

  describe('Getting data from dockerized kafka', () => {
    describe('GET', () => {
      // a topic that exists in docker instance:
      const sampleTopic = 'inventory';

      // connect to kafka before fetching data
      beforeAll(() => {
        return request(server)
          .post('/api/connection')
          .send({
            clientId: 'dockertest',
            brokers: [`${process.env.LOCAL_IP}:${process.env.DOCKER_PORT}`],
          });
      });

      it('gets data from get-data backend route', () => {
        return request(server)
          .get('/api/get-data')
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .then(res => {
            expect(res.body.hasOwnProperty('clusterData'));
            expect(res.body.hasOwnProperty('topicData'));
            expect(res.body.hasOwnProperty('groupData'));
            expect(res.body.hasOwnProperty('groupList'));
          });
      });

      it('gets messages from topic-messages route', () => {
        return request(server)
          .get(`/api/${sampleTopic}/messages`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .then(res => {
            expect(res.body.hasOwnProperty('topicMessages'));
          });
      });

      it('fails to get messages if nonexistent topic is provided', () => {
        return request(server).get(`/api/faketopicfaketopic/messages`).expect(400);
      });
    });
  });
});
