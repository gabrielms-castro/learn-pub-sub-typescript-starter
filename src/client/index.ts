import amqp from 'amqplib';

import { clientWelcome, commandStatus, getInput, printClientHelp } from '../internal/gamelogic/gamelogic.js';
import { declareAndBin, SimpleQueueType } from '../internal/pubsub/consume.js';
import { ExchangePerilDirect, PauseKey } from '../internal/routing/routing.js';
import { GameState } from '../internal/gamelogic/gamestate.js';
import { commandSpawn } from '../internal/gamelogic/spawn.js';
import { commandMove } from '../internal/gamelogic/move.js';

async function main() {
  console.log("Starting Peril client...");
  const connectionString = "amqp://guest:guest@localhost:5672/";
  let connection;
  connection = await amqp.connect(connectionString);

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
      try {
        await connection.close();
      } finally {
        process.exit(0);
      }
    });
  });

  const username = await clientWelcome()

  await declareAndBin(
    connection, 
    ExchangePerilDirect, 
    `${PauseKey}.${username}`,
    PauseKey,
    SimpleQueueType.Transient
  )

  let gameState = new GameState(username)

  while (true) {
    const words = await getInput("Command > ");
    const commandName = words[0];

    if (commandName === "spawn") {
      try {
        commandSpawn(gameState, words)
      } catch (err) {
        console.error("Error:", (err as Error).message, "\n");
      }
    
    } else if (commandName === "move") {
      try {
        commandMove(gameState, words)
      } catch (err) {
        console.error("Error:", (err as Error).message);
      }      
    
    } else if (commandName === "status") {
      try {
        commandStatus(gameState)
      } catch (err) {
        console.error("Error:", (err as Error).message);
      }      

    } else if (commandName === "help") {
      try {
        printClientHelp()
      } catch (err) {
        console.error("Error:", (err as Error).message);
      }      
    
    } else if (commandName === "spam") {
      try {
        console.log("Spamming not allowed yet!")
      } catch (err) {
        console.error("Error:", (err as Error).message);
      }      
    
    } else if (commandName === "quit") {
      try {
        console.log("Goodbye!")
        process.exit(0);
      } catch (err) {
        console.error("Error:", (err as Error).message);
      }     
       
    } else {
      console.log("Unknown command. Type 'help' to see available commands.")
    }



  } 
}


main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
