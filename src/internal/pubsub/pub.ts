import type { ConfirmChannel } from "amqplib";

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