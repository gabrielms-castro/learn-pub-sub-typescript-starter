import amqp from 'amqplib';
import { Channel } from 'diagnostics_channel';
import process from 'process';
import { publishJSON } from '../internal/pubsub/pub.js';
import { ExchangePerilDirect, PauseKey } from '../internal/routing/routing.js';
import type { PlayingState } from '../internal/routing/routing.js';

async function main() {
  console.log("Starting Peril server...");
  
  const connectionString = "amqp://guest:guest@localhost:5672/";
  let connection

  try {
    connection = await amqp.connect(connectionString);

    if (connection) {
      console.log("Successfully connected to RabbitMQ!")
    }

    const channel = await connection.createConfirmChannel()
    const playingState: PlayingState = { IsPaused: true}

    await publishJSON(channel, ExchangePerilDirect, PauseKey, playingState)
    console.log("Published pause message")


  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
    process.exit(1);
  }
  

  process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await connection.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
