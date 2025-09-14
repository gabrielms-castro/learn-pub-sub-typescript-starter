
import type { ConfirmChannel, ChannelModel, Replies } from "amqplib";
import type { Channel } from "diagnostics_channel";

export async function publishJSON<T>(
    ch: ConfirmChannel,
    exchange: string,
    routingKey: string,
    value: T
): Promise<void> {
    const serializedValue = JSON.stringify(value)
    const buffer = Buffer.from(serializedValue)
    await ch.publish(
        exchange,
        routingKey,
        buffer,
        {contentType: "application/json"}
    );
}

export async function declareAndBin(
    conn: ChannelModel,
    exchange: string,
    queueName: string,
    key: string,
    queueType: SimpleQueueType,
): Promise<[Channel, Replies.AssertQueue]> {

}