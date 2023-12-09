import { SQS } from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';

const POLL_TIMEOUT = 1000;

async function messageReceivedHandler(client: SQS, queue: string, message: Message) {
  const { Body, ReceiptHandle } = message;
  console.log('***message', Body);
  return client.deleteMessage({ QueueUrl: queue, ReceiptHandle });
}

async function poll(
  client: SQS,
  queue: string,
  onMessageReceived: (client: SQS, queue: string, message: Message) => void
) {
  const result = await client.receiveMessage({ QueueUrl: queue, MaxNumberOfMessages: 1 });
  if (result?.Messages?.length > 0) {
    const message = result.Messages.at(0);
    await onMessageReceived(client, queue, message);
  }
  setTimeout(() => poll(client, queue, onMessageReceived), POLL_TIMEOUT);
}

(async function main() {
  const {
    ACCESS_KEY_ID: accessKeyId,
    SECRET_ACCESS_KEY: secretAccessKey,
    REGION: region,
    QUEUE_URL: queueUrl,
  } = process.env;

  try {
    const client = new SQS({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    poll(client, queueUrl, messageReceivedHandler);
  } catch (e) {
    console.log(e);
  }
})();
