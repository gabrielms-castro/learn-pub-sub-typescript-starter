import amqp from 'amqplib';
import { Channel } from 'diagnostics_channel';
import process from 'process';
import { publishJSON } from '../internal/pubsub/publish.js';
import { ExchangePerilDirect, PauseKey } from '../internal/routing/routing.js';
import type { PlayingState } from '../internal/routing/routing.js';
import { getInput, printServerHelp } from '../internal/gamelogic/gamelogic.js';

async function main() {
  console.log("Starting Peril server...");
  
  const connectionString = "amqp://guest:guest@localhost:5672/";
  const connection = await amqp.connect(connectionString);
  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
      try {
        await connection.close();
        console.log("RabbitMQ connection closed.")
      } finally {
        process.exit(0);
      }
    });
  });
  const channel = await connection.createConfirmChannel()

  
  printServerHelp()
  while (true) {
    const words = await getInput("Command > ");
    const cmd = words[0];
    
    if (!cmd || words.length === 0) {
      continue;
    }
    
    if (cmd === "pause") {
      console.log("Sending 'pause' message")
      try{
        const playingState: PlayingState = { isPaused: true}
        await publishJSON(channel, ExchangePerilDirect, PauseKey, playingState)
        console.log("Published pause message")
      } catch (err) {
        console.error("Error publishing pause message:", err);
      }

    } else if (cmd === "resume") {
      console.log("Sending 'resume' message")
      try{
        const playingState: PlayingState = { isPaused: false}
        await publishJSON(channel, ExchangePerilDirect, PauseKey, playingState)
        console.log("Published resume message")
      } catch (err) {
        console.error("Error publishing resume message:", err);
      }

    } else if (cmd === "quit") {
      console.log("Exiting. Good bye!")
      process.exit(0);

    } else if (cmd === "help") {
      console.log("Sending 'help' message")
      printServerHelp()

    } else {
      console.log("Command not found. Type 'help' to print existing commands")
    }

  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
