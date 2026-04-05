import { Channel, Message } from 'amqplib';

export function catchWithMessageResilience(
  error: any,
  channel: Channel,
  originalMsg: Message,
) {
  const errorsCode: number[] = [89, 262, 91, 11600, 11602];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  if (errorsCode.includes(error.code)) {
    channel.nack(originalMsg, false, true);
    throw error;
  }

  channel.ack(originalMsg);
  throw error;
}
