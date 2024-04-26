const amqp = require("amqplib");

const consumeMessages = (channel, queueName, callback) => {
    channel.consume(queueName, (msg) => {
        if (msg !== null) {
            callback(msg.content.toString());
            channel.ack(msg); // Acknowledge the message
        }
    });
};

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = process.env.QUEUE;

        // Assert queue exists
        await channel.assertQueue(queue, {
            durable: false
        });

        return {
            channel,
            queue
        };
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};

module.exports = { connectRabbitMQ, consumeMessages };
