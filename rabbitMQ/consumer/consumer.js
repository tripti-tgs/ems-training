const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const jsonParser = bodyParser.json();
const { connectRabbitMQ } = require("../config/db");
router.get("/get", jsonParser, async (req, res) => {
  try {
    // Parse severity from request
    const { severity } = req.query;
    if (!severity) {
      return res.status(400).json({ error: "Severity is required" });
    }
    const { channel, queue } = await connectRabbitMQ();
    channel.assertExchange(process.env.EXCHANGE, "topic", {
      durable: false,
    });
    // Bind the queue to the exchange with the routing key
    await channel.bindQueue(queue, process.env.EXCHANGE, severity);

    // Consume messages from the queue
    channel.consume(
      queue,
      (message) => {
        console.log(" [x] Received %s", message.content.toString());
        res.status(200).json(message.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
