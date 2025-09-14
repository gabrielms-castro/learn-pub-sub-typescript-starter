import amqp, { type Channel, type ChannelModel} from "amqplib";

export enum SimpleQueueType {
    Durable,
    Transient
}

export async function declareAndBin(
    conn: ChannelModel,
    exchange: string,
    queueName: string,
    key: string,
    queueType: SimpleQueueType,
): Promise<[Channel, amqp.Replies.AssertQueue]> {
    
    const ch = await conn.createChannel();
    const queue =  await ch.assertQueue(
        queueName,
        {
            durable: queueType === SimpleQueueType.Durable,
            autoDelete: queueType === SimpleQueueType.Transient,
            exclusive: queueType === SimpleQueueType.Transient,
        }
    )

    await ch.bindQueue(
        queue.queue,
        exchange,
        key
    );

    return [ ch, queue ];
}