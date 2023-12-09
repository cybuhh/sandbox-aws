import { Consumer } from 'sqs-consumer';
import { SQSClient } from '@aws-sdk/client-sqs';

(async function main() {
  try {
    const {
      ACCESS_KEY_ID: accessKeyId,
      SECRET_ACCESS_KEY: secretAccessKey,
      REGION: region,
      QUEUE_URL: queueUrl,
    } = process.env;

    const consumer = Consumer.create({
      queueUrl,
      handleMessage: async (message) => {
        console.log('***msg-received', message);
      },
      sqs: new SQSClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      }),
    });

    consumer.on('error', (err) => {
      console.error(err.message);
    });

    consumer.on('processing_error', (err) => {
      console.error(err.message);
    });

    consumer.on('timeout_error', (err) => {
      console.error(err.message);
    });

    consumer.start();
  } catch (e) {
    console.log(e);
  }
})();
