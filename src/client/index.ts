import amqp from 'amqplib';

import { clientWelcome } from '../internal/gamelogic/gamelogic.js';
import { declareAndBin, SimpleQueueType } from '../internal/pubsub/consume.js';
import { ExchangePerilDirect, PauseKey } from '../internal/routing/routing.js';

async function main() {
  console.log("Starting Peril client...");
  const connectionString = "amqp://guest:guest@localhost:5672/";
  let connection
  try {
    connection = await amqp.connect(connectionString)

    const username = await clientWelcome()

    await declareAndBin(
      connection, 
      ExchangePerilDirect, 
      `${PauseKey}.${username}`,
      PauseKey,
      SimpleQueueType.Transient
    )

  }
  catch (err) {
    console.log(`Failed to connect: ${err}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
