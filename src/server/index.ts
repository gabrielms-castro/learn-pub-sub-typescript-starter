import amqp from 'amqplib';
import process from 'process';

async function main() {
  console.log("Starting Peril server...");
  
  const connectionString = "amqp://guest:guest@localhost:5672/";
  let connection

  try {
    connection = await amqp.connect(connectionString);

    if (connection) {
      console.log("Successfully connected to RabbitMQ!")
    }

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
