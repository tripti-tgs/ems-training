const express = require('express');
const bodyParser = require('body-parser');
const {connectRabbitMQ} = require('../config/db');

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/publish', jsonParser, async (req, res, next) => {
    const { message } = req.body;

    try {
        // Check if message is provided
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Connect to RabbitMQ
        const {channel} = await connectRabbitMQ();

        // Declare exchange
        const exchange = process.env.EXCHANGE

        await channel.assertExchange(exchange, 'topic', {
            durable: false 
        });

        // Extract key from request body or use default
        const key = req.body.severity || 'anonymous.info';

        // Send message to exchange
        channel.publish(exchange, key, Buffer.from(message));

        console.log(" [x] Sent %s", message);
        res.json('Data sent to RabbitMQ');

    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
});

module.exports = router;
