import { SQS } from '@aws-sdk/client-sqs';

(async function main() {
  const {
    ACCESS_KEY_ID: accessKeyId,
    SECRET_ACCESS_KEY: secretAccessKey,
    REGION: region,
    QUEUE_URL: QueueUrl,
  } = process.env;

  try {
    const client = new SQS({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    console.log('--- sending new message');
    await client.sendMessage({
      QueueUrl,
      MessageGroupId: '1',
      MessageDeduplicationId: Date.now().toString(),
      MessageBody: JSON.stringify({ foo: 'bar', timestamp: Date.now() }),
    });
  } catch (e) {
    console.log(e);
  }
})();
